export const NAME = 'Network';

export default class NetworkError extends Error {
  constructor(message?: string) {
    super(message || NAME);
    this.name = NAME;
  }
}
