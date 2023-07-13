import { FC, useCallback, useEffect, useState } from 'react';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import useLifecycle, {
  LIFECYCLE,
  Lifecycle,
  LifecycleGetter,
  LifecycleValue,
} from '@core/hooks/useLifecycle';

import OneTimeDialogContextProvider, { useOneTimeDialogContext } from '.';

type OneTimeDialogProps = FC<{
  dialogId: LIFECYCLE;
  getter?: (lifecycle: LifecycleValue) => LifecycleGetter;
  setter?: (lifecycle: LifecycleValue) => LifecycleValue;
  show?: boolean;
  force?: boolean;
  children: FC<{ onClose: () => void; open: boolean }>;
}>;
export const OneTimeDialog: OneTimeDialogProps = ({
  dialogId,
  getter = (lifecycle: LifecycleValue) => lifecycle,
  setter = () => true,
  show = true,
  force,
  children,
}) => {
  const { activeDialog, onMount, onUnmount, sawDialog } =
    useOneTimeDialogContext();
  const { currentUser } = useCurrentUserContext();
  const lifecycle = currentUser?.userSettings.lifecycle as Lifecycle;
  const { update: saveStep } = useLifecycle();

  const displayDialog = show && (force || !sawDialog(dialogId, getter));

  useEffect(() => {
    if (displayDialog) {
      onMount(dialogId);
    }
    return () => {
      onUnmount(dialogId);
    };
  }, [dialogId, displayDialog, onMount, onUnmount]);

  const onClose = () => {
    const value = setter(lifecycle?.[dialogId]);
    if (value && !!currentUser) {
      saveStep(dialogId, value);
    }
    onUnmount(dialogId);
  };

  return children({
    onClose,
    open: displayDialog && activeDialog === dialogId,
  });
};

export const OneTimeDialogProvider: FC = ({ children }) => {
  const [queue, setQueue] = useState<LIFECYCLE[]>([]);
  const { currentUser } = useCurrentUserContext();

  // Add dialogId to the queue
  const onMount = useCallback(
    (dialogId: LIFECYCLE) => {
      setQueue(q => [...q, dialogId]);
    },
    [setQueue]
  );
  // Remove dialogId from the queue
  const onUnmount = useCallback(
    (dialogId: LIFECYCLE) => {
      setQueue(q => q.filter(e => e !== dialogId));
    },
    [setQueue]
  );

  const sawDialog = useCallback(
    (
      dialogId: LIFECYCLE,
      getter: (lifecycle: LifecycleValue) => LifecycleGetter = lifecycle =>
        lifecycle
    ) => {
      const lifecycle = currentUser?.userSettings.lifecycle as Lifecycle;
      if (!lifecycle) {
        return false;
      }
      return !!getter(lifecycle[dialogId]);
    },
    [currentUser?.userSettings.lifecycle]
  );

  return (
    <OneTimeDialogContextProvider
      value={{
        onMount,
        onUnmount,
        activeDialog: queue[0],
        sawDialog,
      }}
    >
      {children}
    </OneTimeDialogContextProvider>
  );
};

export default OneTimeDialogProvider;
