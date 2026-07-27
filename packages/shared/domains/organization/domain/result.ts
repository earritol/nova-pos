export interface FieldError {
  field: string;
  message: string;
}

export interface AppError {
  code: string;
  message: string;
  fields?: FieldError[];
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<T>(code: string, message: string, fields?: FieldError[]): Result<T> {
  return { success: false, error: fields ? { code, message, fields } : { code, message } };
}
