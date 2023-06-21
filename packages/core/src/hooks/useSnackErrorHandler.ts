import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { AppError, errorWrapper } from 'errors';

const useSnackErrorHandler = () => {
  const { showNotification } = useSnackNotificationContext();

  function snackErrorHandler<T extends (...args: any) => any>(
    fn: T,
    rescueFrom?: AppError[]
  ): (...args: Parameters<T>) => Promise<{
    error?: { name: AppError; message: string };
    result?: ReturnType<T>;
  }> {
    return async (...args: Parameters<T>) => {
      const { error, result } = await errorWrapper(fn, rescueFrom)(...args);
      if (error) {
        showNotification(
          'errors',
          { errors: `${error.name} - ${error.message}` },
          { level: Level.ERROR }
        );
        return { error };
      }

      return { result };
    };
  }

  return snackErrorHandler;
};

export default useSnackErrorHandler;
