const sendSuccess = (res, message, data = null) => {
  res.status(200).json({
    status: true,
    statusCode: 200,
    message: message,
    data: data,
  });
};

// Middleware to handle error responses
const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: false,
    statusCode: statusCode,
    message: message,
  });
};

module.exports = { sendSuccess, sendError };
