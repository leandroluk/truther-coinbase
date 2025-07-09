export class UnauthorizedError extends Error {
  static DEFAULT_MESSAGE = 'Unauthorized';

  static is(value: any): value is UnauthorizedError {
    return value?.name === 'UnauthorizedError';
  }

  constructor(message = UnauthorizedError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
