const { logger } = require('./logger');

class ErrorHandler {
  constructor() {
    this.errors = new Map();
  }

  /
    Logs an error message and optionally throws an error.
    @param {Error} error The error object to log.
    @param {string} message An optional custom error message to log.
    @param {boolean} throwError Whether to throw an error after logging. Defaults to true.
   /
  logError(error, message, throwError = true) {
    logger.error(message || error.message);

    // If throwError is true, re-throw the error to allow the caller to handle it
    if (throwError) {
      throw error;
    }
  }

  /
    Catches an error and logs it. Optionally re-throws the error.
    @param {Function} callback The function to execute.
    @param {boolean} throwError Whether to re-throw the error after logging. Defaults to true.
    @returns {Promise<any>} A promise that resolves with the result of the callback or rejects with the error.
   /
  async catchError(callback, throwError = true) {
    try {
      return await callback();
    } catch (error) {
      this.logError(error, null, throwError);
    }
  }

  /
    Handles a specific error type by logging it and optionally throwing an error.
    @param {string} errorType The error type to handle.
    @param {Error} error The error object to log.
    @param {string} message An optional custom error message to log.
    @param {boolean} throwError Whether to throw an error after logging. Defaults to true.
   /
  handleSpecificError(errorType, error, message, throwError = true) {
    // Check if the error type is already being handled
    if (this.errors.has(errorType)) {
      // Do nothing if the error type is already being handled
      return;
    }

    this.errors.set(errorType, true);
    this.logError(error, message, throwError);
  }

  /
    Logs an error message without throwing an error.
    @param {Error} error The error object to log.
    @param {string} message An optional custom error message to log.
   /
  logWarning(error, message) {
    logger.warn(message || error.message);
  }
}

module.exports = new ErrorHandler();