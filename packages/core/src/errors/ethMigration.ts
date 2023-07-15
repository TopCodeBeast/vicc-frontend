export const NAME = 'EthMigration';

export default class EthMigrationError extends Error {
  constructor(message?: string) {
    super(message || NAME);
    this.name = NAME;
  }
}
