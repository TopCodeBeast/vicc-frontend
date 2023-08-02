import useCreateFastWithdrawal from './useCreateFastWithdrawal';
import usePrepareFastWithdrawal from './usePrepareFastWithdrawal';

export default () => {
  const prepare = usePrepareFastWithdrawal();
  const create = useCreateFastWithdrawal();

  return async (amount: string, to: string) => {
    const prepareFastWithdrawal = await prepare(amount, to);

    if (prepareFastWithdrawal.errors && prepareFastWithdrawal.errors.length > 0)
      return prepareFastWithdrawal.errors;

    const transfer = prepareFastWithdrawal.fastWithdrawal!;

    return create(amount, to, transfer);
  };
};
