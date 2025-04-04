"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message = 'Success', statusCode = 200) => ({
    status: 'success',
    statusCode,
    message,
    data
});
exports.successResponse = successResponse;
const errorResponse = (message, statusCode = 500, error) => ({
    status: 'error',
    statusCode,
    message,
    error
});
exports.errorResponse = errorResponse;
