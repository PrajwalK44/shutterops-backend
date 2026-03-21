const { query } = require("../db");

const ALLOWED_ROLES = ["Admin", "Senior", "Member"];

async function createUsersTable() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      roll_no TEXT UNIQUE,
      class_branch TEXT,
      role TEXT NOT NULL CHECK (role IN ('Admin', 'Senior', 'Member')),
      skill_level TEXT,
      is_available BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAllUsers(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.role) {
    values.push(filters.role);
    conditions.push(`role = $${values.length}`);
  }

  if (typeof filters.isAvailable === "boolean") {
    values.push(filters.isAvailable);
    conditions.push(`is_available = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await query(
    `
      SELECT id, name, roll_no, class_branch, role, skill_level, is_available, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
    `,
    values,
  );

  return result.rows;
}

async function getUserById(id) {
  const result = await query(
    `
      SELECT id, name, roll_no, class_branch, role, skill_level, is_available, created_at, updated_at
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
}

async function createUser(payload) {
  const result = await query(
    `
      INSERT INTO users (name, roll_no, class_branch, role, skill_level, is_available)
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, true))
      RETURNING id, name, roll_no, class_branch, role, skill_level, is_available, created_at, updated_at
    `,
    [
      payload.name,
      payload.roll_no || null,
      payload.class_branch || null,
      payload.role,
      payload.skill_level || null,
      typeof payload.is_available === "boolean" ? payload.is_available : null,
    ],
  );

  return result.rows[0];
}

async function updateUserById(id, updates) {
  const fieldMap = {
    name: "name",
    roll_no: "roll_no",
    class_branch: "class_branch",
    role: "role",
    skill_level: "skill_level",
    is_available: "is_available",
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
    return getUserById(id);
  }

  values.push(id);

  const result = await query(
    `
      UPDATE users
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING id, name, roll_no, class_branch, role, skill_level, is_available, created_at, updated_at
    `,
    values,
  );

  return result.rows[0] || null;
}

async function updateUserAvailability(id, isAvailable) {
  const result = await query(
    `
      UPDATE users
      SET is_available = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, roll_no, class_branch, role, skill_level, is_available, created_at, updated_at
    `,
    [isAvailable, id],
  );

  return result.rows[0] || null;
}

module.exports = {
  ALLOWED_ROLES,
  createUsersTable,
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvailability,
};
