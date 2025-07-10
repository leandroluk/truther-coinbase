export class ValidationError extends Error {
  static DEFAULT_MESSAGE = 'Validation error';

  static is(value: any): value is ValidationError {
    return value?.name === 'ValidationError';
  }

  constructor(message = ValidationError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'ValidationError';
  }
}
