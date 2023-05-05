const HttpStatusCode = require('./HttpStatusCode');

class BaseError extends Error {
  name;
  httpCode;
  isOperational;
  message;

  constructor(name, httpCode, isOperational, message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.message = message;

    Error.captureStackTrace(this);
  }
}

class APIError extends BaseError {
  constructor(
    name,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = 'internal server error'
  ) {
    super(name, httpCode, isOperational, description);
  }
}

class HTTP400Error extends BaseError {
  constructor(description = 'Bad request') {
    super('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, description);
  }
}

class HTTP404Error extends BaseError {
  constructor(description = 'Not found') {
    super('NOT FOUND', HttpStatusCode.NOT_FOUND, true, description);
  }
}

class HTTP401Error extends BaseError {
  constructor(description = 'Unauthorised user') {
    super('UNAUTHORISED', HttpStatusCode.UNAUTHORISED, true, description);
  }
}

const handleError = (error) => {
  if (error.name === 'ValidationError') {
    throw new HTTP400Error(`${Object.keys(error.errors).join(', ')} required.`);
  } else if (Object.keys(error.keyValue)[0]) {
    throw new HTTP400Error(`${Object.keys(error.keyValue)[0]} is already in use.`);
  } else {
    throw new APIError('Internal Server Error');
  }
};

module.exports = {
  APIError,
  HTTP400Error,
  HTTP401Error,
  HTTP404Error,
  handleError,
};
