export class ServerError extends Error {
  static DEFAULT_MESSAGE = 'Server error';

  static is(value: any): value is ServerError {
    return value?.name === 'ServerError';
  }

  constructor(message = ServerError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'ServerError';
  }
}
