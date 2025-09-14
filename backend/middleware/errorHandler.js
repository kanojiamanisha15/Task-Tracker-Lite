// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // MySQL errors
  if (err.code === "ER_DUP_ENTRY") {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    const message = "Referenced record not found";
    error = { message, statusCode: 400 };
  }

  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    const message = "Cannot delete record as it is referenced by other records";
    error = { message, statusCode: 400 };
  }

  // Validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401 };
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const message = "Invalid JSON in request body";
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
