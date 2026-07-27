import type { FieldError } from './result';

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}
