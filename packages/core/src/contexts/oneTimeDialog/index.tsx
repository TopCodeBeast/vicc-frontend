import { createContext, useContext } from 'react';

import { LIFECYCLE, LifecycleGetter, LifecycleValue } from '@sorare/core/src/hooks/useLifecycle';

export interface OneTimeDialogContext {
  sawDialog: (
    dialogId: LIFECYCLE,
    getter?: (lifecycle: LifecycleValue) => LifecycleGetter
  ) => boolean;
  activeDialog?: LIFECYCLE;
  onMount: (dialogId: LIFECYCLE) => void;
  onUnmount: (dialogId: LIFECYCLE) => void;
}

export const oneTimeDialogContext = createContext<OneTimeDialogContext | null>(
  null
);

export const useOneTimeDialogContext = () => useContext(oneTimeDialogContext)!;

export default oneTimeDialogContext.Provider;
