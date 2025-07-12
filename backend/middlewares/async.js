// middlewares/async.js
const asyncHandler = (fn, errorLogger = console.error) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // Log the error with context
    errorLogger({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      user: req.user?._id || 'unauthenticated',
      ip: req.ip
    });

    // Handle specific error types
    let statusCode = 500;
    let message = 'Server error';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(val => val.message);
    } 
    else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue)[0];
      message = `${field} already exists`;
    }
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
    else if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    }
    else if (error instanceof ErrorResponse) {
      statusCode = error.statusCode;
      message = error.message;
    }

    // Send response
    res.status(statusCode).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
  }
};

module.exports = asyncHandler;