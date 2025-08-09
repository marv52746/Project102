// utils/activityLogger.js

const { ActivityDb } = require("../model/Activity");

/**
 * Logs an activity into the Activity collection
 * @param {string} action - The action performed (create, update, delete, view, etc.)
 * @param {string} tableName - The table/collection name
 * @param {Object} record - The affected document or object
 * @param {string} userId - The user who performed the action
 * @param {string} description - Optional custom description
 */
async function logActivity(
  action,
  tableName,
  record,
  userId = null,
  description = null
) {
  try {
    await ActivityDb.create({
      action,
      table: tableName,
      recordId: record._id,
      userId: userId || null,
      description: description || `${action} ${tableName} record`,
      dataSnapshot: record.toObject ? record.toObject() : record,
    });
  } catch (err) {
    console.error("❌ Activity Log Error:", err.message);
  }
}

module.exports = { logActivity };
