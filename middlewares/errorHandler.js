function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    data: error.details || {},
    message: error.message || "Internal server error",
  });
}

module.exports = errorHandler;
