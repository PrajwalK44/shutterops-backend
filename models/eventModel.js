const { query } = require("../db");

async function createEventTable() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS events (
      event_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      description TEXT,
      date        DATE NOT NULL,
      venue       TEXT,
      status      TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
      created_by  UUID REFERENCES users(id),
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function createEvent(payload) {
  const result = await query(
    `
      INSERT INTO events (name, description, date, venue, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [
      payload.name,
      payload.description || null,
      payload.date,
      payload.venue || null,
      payload.created_by || null,
    ]
  );
  return result.rows[0];
}

async function getAllEvents(status) {
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await query(
    `
      SELECT *
      FROM events
      ${whereClause}
      ORDER BY date ASC
    `,
    values
  );
  return result.rows;
}

async function getEventById(event_id) {
  const result = await query(
    `SELECT * FROM events WHERE event_id = $1`,
    [event_id]
  );
  return result.rows[0] || null;
}

async function updateEvent(event_id, updates) {
  const fieldMap = {
    name: "name",
    description: "description",
    date: "date",
    venue: "venue",
    status: "status",
  };

  const setClauses = [];
  const values = [];

  Object.keys(fieldMap).forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      values.push(updates[field]);
      setClauses.push(`${fieldMap[field]} = $${values.length}`);
    }
  });

  if (!setClauses.length) {
    return getEventById(event_id);
  }

  values.push(event_id);

  const result = await query(
    `
      UPDATE events
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE event_id = $${values.length}
      RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}

async function deleteEvent(event_id) {
  const result = await query(
    `DELETE FROM events WHERE event_id = $1 RETURNING *`,
    [event_id]
  );
  return result.rows[0] || null;
}

async function getEventDashboard(event_id) {
  const result = await query(
    `
      SELECT
        json_build_object(
          'event_id', e.event_id,
          'name', e.name,
          'date', e.date,
          'venue', e.venue,
          'status', e.status
        ) AS event,
        (
          SELECT json_build_object(
            'total', COUNT(*),
            'open', COUNT(*) FILTER (WHERE status = 'open'),
            'assigned', COUNT(*) FILTER (WHERE status = 'assigned'),
            'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
            'submitted', COUNT(*) FILTER (WHERE status = 'submitted'),
            'verified', COUNT(*) FILTER (WHERE status = 'verified'),
            'rejected', COUNT(*) FILTER (WHERE status = 'rejected')
          ) FROM task_slots ts WHERE ts.event_id = e.event_id
        ) AS slot_summary,
        (
          SELECT COALESCE(json_agg(
            json_build_object(
              'user_id', u.id,
              'name', u.name,
              'slot_title', ts.title,
              'slot_status', ts.status
            )
          ), '[]'::json)
          FROM task_slots ts
          JOIN users u ON u.id = ts.assigned_to
          WHERE ts.event_id = e.event_id AND ts.assigned_to IS NOT NULL
        ) AS assigned_members,
        (
          SELECT COALESCE(json_agg(
            json_build_object(
              'slot_id', ts.slot_id,
              'title', ts.title,
              'upload_url', ts.upload_url,
              'assigned_to', ts.assigned_to
            )
          ), '[]'::json)
          FROM task_slots ts
          WHERE ts.event_id = e.event_id AND ts.status = 'submitted'
        ) AS unverified_uploads
      FROM events e
      WHERE e.event_id = $1
    `,
    [event_id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createEventTable,
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventDashboard,
};
