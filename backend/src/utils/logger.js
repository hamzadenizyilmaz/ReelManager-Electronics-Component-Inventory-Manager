function logActivity(prisma, req, action, entityType, entityId, oldValue, newValue) {
  return prisma.activityLog.create({
    data: {
      userId: req.user?.id || null,
      action,
      entityType,
      entityId,
      oldValue: oldValue || undefined,
      newValue: newValue || undefined,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null
    }
  }).catch((err) => console.error("activity log failed", err.message));
}

module.exports = { logActivity };
