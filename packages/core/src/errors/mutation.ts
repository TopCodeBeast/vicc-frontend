export const NAME = 'Mutation';

export default class MutationError extends Error {
  constructor(message?: string) {
    super(message || NAME);
    this.name = NAME;
  }
}
