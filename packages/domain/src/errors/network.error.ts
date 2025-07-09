export class NetworkError extends Error {
  static DEFAULT_MESSAGE = 'Network error';

  static is(value: any): value is NetworkError {
    return value?.name === 'NetworkError';
  }

  constructor(message = NetworkError.DEFAULT_MESSAGE) {
    super(message);
    this.name = 'NetworkError';
  }
}
