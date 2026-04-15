export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'OVERLAP_CONFLICT'
  | 'INTERNAL_ERROR';

export type ErrorPayload = {
  message: string;
  code: ErrorCode;
  details?: unknown;
};

export class AppError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(status: number, message: string, code: ErrorCode, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const validationError = (message: string, details?: unknown) =>
  new AppError(400, message, 'VALIDATION_ERROR', details);

export const unauthenticatedError = (message = 'Authentication required') =>
  new AppError(401, message, 'UNAUTHENTICATED');

export const unauthorizedError = (message = 'You do not have access to this resource') =>
  new AppError(403, message, 'UNAUTHORIZED');

export const notFoundError = (message = 'Resource not found') =>
  new AppError(404, message, 'NOT_FOUND');

export const conflictError = (message: string, details?: unknown) =>
  new AppError(409, message, 'OVERLAP_CONFLICT', details);

export const internalError = (message = 'Something went wrong', details?: unknown) =>
  new AppError(500, message, 'INTERNAL_ERROR', details);

export function toErrorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    const payload: ErrorPayload = {
      message: error.message,
      code: error.code,
      details: error.details,
    };
    return Response.json(payload, { status: error.status });
  }

  const payload: ErrorPayload = {
    message: 'Unexpected server error',
    code: 'INTERNAL_ERROR',
  };

  return Response.json(payload, { status: 500 });
}
