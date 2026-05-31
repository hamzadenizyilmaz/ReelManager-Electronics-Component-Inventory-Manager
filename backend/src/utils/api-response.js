function ok(res, message, data = null, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

function fail(res, message, errors = [], status = 400) {
  return res.status(status).json({ success: false, message, errors });
}

module.exports = { ok, fail };
