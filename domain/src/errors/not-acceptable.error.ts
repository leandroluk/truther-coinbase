export class NotAcceptableError extends Error {
  static DEFAULT_MESSAGE = 'Not Acceptable';

  static is(value: any): value is NotAcceptableError {
    return value?.name === 'NotAcceptableError';
  }

  constructor(message = NotAcceptableError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'NotAcceptableError';
  }
}
