import { useEffect, useState } from 'react';

// import { Deferred } from '@sorare/wallet-shared';
class Deferred<T> {
  promise: any;
  pending: boolean = false;
  resolve(success: boolean) {

  }
}

type Handler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

export default (handler?: Handler, disable?: boolean) => {
  const [deferred, setDeferred] = useState(new Deferred<boolean>());

  useEffect(() => {
    // if the component unmount after trigger the handler
    // timeout will always be undefined. Let's use a double check
    // to avoid no-op react errors.
    let timeout: NodeJS.Timeout | undefined;
    let isSubscribed = true;
    const reschedule = async () => {
      await deferred.promise;
      timeout = setTimeout(() => {
        if (isSubscribed) {
          setDeferred(new Deferred<boolean>());
        }
      }, 1000);
    };
    reschedule();
    return () => {
      isSubscribed = false;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [deferred]);

  if (!handler) return undefined;
  if (disable) return handler;

  return (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (!deferred.pending) return;

    deferred.resolve(true);
    handler(event);
  };
};
