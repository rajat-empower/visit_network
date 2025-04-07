export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}

export const successResponse = <T>(data: T, message: string = 'Success', statusCode: number = 200): ApiResponse<T> => ({
  status: 'success',
  statusCode,
  message,
  data
});

export const errorResponse = (message: string, statusCode: number = 500, error?: string): ApiResponse => ({
  status: 'error',
  statusCode,
  message,
  error
}); 