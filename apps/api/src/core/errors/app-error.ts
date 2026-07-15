/**
 * Jerarquía de errores de dominio — Backend Architecture Specification §8.
 *
 * Todo error de negocio extiende `AppError`, con un `code` estable (usado en el
 * envelope de respuesta), un `httpStatus` y `details` opcionales. El middleware
 * de manejo de errores (`error-handler.ts`) es el único lugar que traduce estos
 * errores a una respuesta HTTP.
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly httpStatus = 400;
}

export class UnauthenticatedError extends AppError {
  readonly code = "UNAUTHENTICATED";
  readonly httpStatus = 401;
}

export class ForbiddenError extends AppError {
  readonly code = "FORBIDDEN";
  readonly httpStatus = 403;
}

export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";
  readonly httpStatus = 404;
}

export class ConflictError extends AppError {
  readonly code = "CONFLICT";
  readonly httpStatus = 409;
}

export class ExternalServiceError extends AppError {
  readonly code = "EXTERNAL_SERVICE_ERROR";
  readonly httpStatus = 502;
}
