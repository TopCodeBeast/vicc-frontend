export const NAME = 'MigratorApproval';

export default class MigratorApprovalError extends Error {
  constructor(message?: string) {
    super(message || 'migrator not approved');
    this.name = NAME;
  }
}
