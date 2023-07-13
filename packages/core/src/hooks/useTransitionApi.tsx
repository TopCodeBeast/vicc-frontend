import { flushSync } from 'react-dom';

const useTransitionApi = (props?: {
  skipTransition?: boolean;
  classnames?: string[];
}) => {
  const { skipTransition = false, classnames = [] } = props || {};
  const updateDOM = (callback: () => void) => {
    flushSync(() => {
      if (skipTransition || !(document as any).startViewTransition) {
        const updateCallbackDone = Promise.resolve(callback()).then(() => {});
        const ready = Promise.reject(Error('View transitions unsupported'));
        // Avoid spamming the console with this error unless the promise is used.
        ready.catch(() => {});
        return {
          ready,
          updateCallbackDone,
          finished: updateCallbackDone,
          skipTransition: () => {},
        };
      }
      document.documentElement.classList.add(...classnames);
      const transition = (document as any).startViewTransition(callback);
      transition.finished.finally(() =>
        document.documentElement.classList.remove(...classnames)
      );
      return transition;
    });
  };
  return { updateDOM };
};

export default useTransitionApi;
