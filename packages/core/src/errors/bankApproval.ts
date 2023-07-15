export const NAME = 'BankApproval';

const defaultMessage =
  'Your sales account is being created on Ethereum. This process can take up to 2 days.';

export default class BankApprovalError extends Error {
  constructor(message?: string) {
    super(message || defaultMessage);
    this.name = NAME;
  }
}
