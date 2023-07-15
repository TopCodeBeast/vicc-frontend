export const NAME = 'WalletAccess';

export default class WalletAccessError extends Error {
  constructor(message?: string) {
    super(message || NAME);
    this.name = NAME;
  }
}
