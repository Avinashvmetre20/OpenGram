class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // This is to distinguish operational errors from programming errors
    
    // Capturing the stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
  
  // Static method to create common error responses
  static badRequest(message = 'Bad Request') {
    return new ErrorResponse(message, 400);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ErrorResponse(message, 401);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ErrorResponse(message, 403);
  }
  
  static notFound(message = 'Resource Not Found') {
    return new ErrorResponse(message, 404);
  }
  
  static conflict(message = 'Conflict') {
    return new ErrorResponse(message, 409);
  }
  
  static serverError(message = 'Internal Server Error') {
    return new ErrorResponse(message, 500);
  }
}

module.exports = ErrorResponse;