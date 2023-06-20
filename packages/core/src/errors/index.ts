import MutationError, { NAME as MUTATION_ERROR } from 'errors/mutation';
import NetworkError, { NAME as NETWORK_ERROR } from 'errors/network';
import WalletAccessError, {
  NAME as WALLET_ACCESS_ERROR,
} from 'errors/walletAccess';
import { Await } from 'types';

import BankApprovalError, { NAME as BANK_APPROVAL_ERROR } from './bankApproval';
import EthMigrationError, { NAME as ETH_MIGRATION_ERROR } from './ethMigration';
import MigratorApprovalError, {
  NAME as MIGRATOR_APPROVAL_ERROR,
} from './migratorApproval';

export const errors = [
  BANK_APPROVAL_ERROR,
  ETH_MIGRATION_ERROR,
  MIGRATOR_APPROVAL_ERROR,
  MUTATION_ERROR,
  NETWORK_ERROR,
  WALLET_ACCESS_ERROR,
] as const;

export type AppError = (typeof errors)[number];

export function isAppError(errorName: string): errorName is AppError {
  return errors.includes(errorName as any);
}

export function errorWrapper<T extends (...args: any[]) => any>(
  fn: T,
  rescueFrom?: AppError[]
): (...args: Parameters<T>) => Promise<{
  error?: { name: AppError; message: string };
  result?: Await<ReturnType<T>>;
}> {
  return async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      return { result };
    } catch (error: any) {
      const { name, message } = error;
      if (isAppError(name) && (rescueFrom || errors).includes(name))
        return { error: { name, message } };

      throw error;
    }
  };
}

export {
  BankApprovalError,
  EthMigrationError,
  MigratorApprovalError,
  MutationError,
  NetworkError,
  WalletAccessError,
};
