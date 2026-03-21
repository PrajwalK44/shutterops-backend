const { query } = require("../db");
const { getSwapStats } = require("./swapRequestService");

async function getCount(sql, params = []) {
  const result = await query(sql, params);
  return Number(result.rows[0].count || 0);
}

async function getEventAnalytics(eventId) {
  const [
    equipmentCount,
    assignedEquipmentCount,
    handoverCount,
    confirmedHandoverCount,
    swapStats,
  ] = await Promise.all([
    getCount(`SELECT COUNT(*)::int AS count FROM equipment WHERE event_id = $1`, [eventId]),
    getCount(
      `SELECT COUNT(*)::int AS count FROM equipment WHERE event_id = $1 AND status = 'assigned'`,
      [eventId],
    ),
    getCount(`SELECT COUNT(*)::int AS count FROM handover_logs WHERE event_id = $1`, [eventId]),
    getCount(
      `SELECT COUNT(*)::int AS count FROM handover_logs WHERE event_id = $1 AND status = 'confirmed'`,
      [eventId],
    ),
    getSwapStats({ event_id: eventId }),
  ]);

  return {
    event_id: eventId,
    usage_counts: {
      equipment: equipmentCount,
      handovers: handoverCount,
    },
    assignment_stats: {
      assigned_equipment: assignedEquipmentCount,
      confirmed_handovers: confirmedHandoverCount,
    },
    swap_stats: swapStats,
  };
}

async function getUserAnalytics(userId) {
  const [
    assignedEquipment,
    handoversSent,
    handoversReceived,
    swapsRequested,
    swapsPeer,
    approvedSwaps,
  ] = await Promise.all([
    getCount(`SELECT COUNT(*)::int AS count FROM equipment WHERE assigned_to = $1`, [userId]),
    getCount(`SELECT COUNT(*)::int AS count FROM handover_logs WHERE from_user = $1`, [userId]),
    getCount(`SELECT COUNT(*)::int AS count FROM handover_logs WHERE to_user = $1`, [userId]),
    getCount(`SELECT COUNT(*)::int AS count FROM swap_requests WHERE requester_id = $1`, [userId]),
    getCount(`SELECT COUNT(*)::int AS count FROM swap_requests WHERE peer_id = $1`, [userId]),
    getCount(
      `
        SELECT COUNT(*)::int AS count
        FROM swap_requests
        WHERE status = 'Approved'
          AND (requester_id = $1 OR peer_id = $1)
      `,
      [userId],
    ),
  ]);

  return {
    user_id: userId,
    usage_counts: {
      handovers_sent: handoversSent,
      handovers_received: handoversReceived,
      swaps_requested: swapsRequested,
      swaps_as_peer: swapsPeer,
    },
    assignment_stats: {
      assigned_equipment: assignedEquipment,
    },
    swap_stats: {
      approved_involved: approvedSwaps,
    },
  };
}

async function getEquipmentUsageAnalytics() {
  const [
    totalEquipment,
    byStatus,
    byType,
    activeAssignments,
    totalHandovers,
    totalSwaps,
    swapStats,
  ] = await Promise.all([
    getCount(`SELECT COUNT(*)::int AS count FROM equipment`),
    query(
      `
        SELECT status AS _id, COUNT(*)::int AS count
        FROM equipment
        GROUP BY status
      `,
    ).then((res) => res.rows),
    query(
      `
        SELECT type AS _id, COUNT(*)::int AS count
        FROM equipment
        GROUP BY type
      `,
    ).then((res) => res.rows),
    getCount(`SELECT COUNT(*)::int AS count FROM equipment WHERE status = 'assigned'`),
    getCount(`SELECT COUNT(*)::int AS count FROM handover_logs`),
    getCount(`SELECT COUNT(*)::int AS count FROM swap_requests`),
    getSwapStats(),
  ]);

  return {
    usage_counts: {
      total_equipment: totalEquipment,
      total_handovers: totalHandovers,
      total_swaps: totalSwaps,
    },
    assignment_stats: {
      active_assignments: activeAssignments,
      by_status: byStatus,
      by_type: byType,
    },
    swap_stats: swapStats,
  };
}

module.exports = {
  getEventAnalytics,
  getUserAnalytics,
  getEquipmentUsageAnalytics,
};
