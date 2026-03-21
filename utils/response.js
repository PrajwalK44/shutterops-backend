function sendSuccess(res, statusCode, data = {}, message = "") {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

module.exports = {
  sendSuccess,
};
