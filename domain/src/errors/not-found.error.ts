export class NotFoundError extends Error {
  static DEFAULT_MESSAGE = 'Not found';

  static is(value: any): value is NotFoundError {
    return value?.name === 'NotFoundError';
  }

  constructor(message = NotFoundError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'NotFoundError';
  }
}
