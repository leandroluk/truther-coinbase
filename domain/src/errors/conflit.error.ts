export class ConflitError extends Error {
  static DEFAULT_MESSAGE = 'Conflit';

  static is(value: any): value is ConflitError {
    return value?.name === 'ConflitError';
  }

  constructor(message = ConflitError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'ConflitError';
  }
}
