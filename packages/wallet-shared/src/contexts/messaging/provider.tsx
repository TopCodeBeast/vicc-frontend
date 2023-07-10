import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { toBase64 } from '../../lib/base64';
import Deferred from '../../lib/deferred';
import { useMutex } from '../mutex/useMutex';
import {
  MessagingContext,
  READY_HANDLER_NAME,
  RPC,
  Ready,
  Request,
  RequestData,
  RequestMessage,
  Response,
  ResponseData,
  ResponseMessage,
  isRequest,
  isResponse,
} from './types';

export interface Props<T> {
  Context: React.Context<MessagingContext<T> | null>;
  allowedOrigins: string[];
  target: {
    window?: Window;
    origin: string;
  };
  children: ReactNode;
}

const newUuid = () => toBase64(crypto.getRandomValues(new Uint8Array(12)));

export type HandlerFn<T> = (
  req: RequestMessage<T>['args']
) => Promise<ResponseMessage>;

export const MessagingProvider = <T,>({
  Context,
  allowedOrigins,
  target,
  children,
}: Props<T>) => {
  const MutexRunner = useMutex();
  const consumeRequestsMutex = useMemo(
    () => new MutexRunner('consumeRequests'),
    [MutexRunner]
  );
  const [responseQueue, setResponseQueue] = useState<Response[]>([]);
  const [sentRequestQueue, setSentRequestQueue] = useState<RequestData<T>[]>(
    []
  );
  const [receivedRequestQueue, setReceivedRequestQueue] = useState<
    Request<T>[]
  >([]);
  const [handlers, setHandlers] = useState<{
    [key: string]: HandlerFn<T> | undefined;
  }>({});
  const [pendingResponses, setPendingResponses] = useState<{
    [uuid: string]: Deferred<ResponseMessage>;
  }>({});
  const [targetReady, setTargetReady] = useState(false);

  const handleEvent = useCallback(
    async (event: MessageEvent) => {
      const { uuid, handler, args } = event.data;
      const handlerFn =
        handlers[handler as unknown as string] ||
        (args?.swallowIfNoHandler
          ? async () => Promise.resolve({})
          : undefined);
      const response = await handlerFn!(args);
      const responseData: ResponseData = {
        type: 'response',
        uuid,
        ...response,
      };
      (event.source as Window).postMessage(responseData, event.origin);
    },
    [handlers]
  );

  // store all valid incoming requests
  useEffect(() => {
    const receiveRequest = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return;
      if (!isRequest<T>(event)) return;
      if (!event.source) return;
      const { args } = event.data;
      if ((args as any)?.flushMessagingQueue) {
        setReceivedRequestQueue([]);
      }
      if ((args as any)?.bypassMessagingQueue) {
        handleEvent(event);
        return;
      }
      setReceivedRequestQueue(prevRequestQueue => [...prevRequestQueue, event]);
    };

    window.addEventListener('message', receiveRequest, false);
    return () => {
      window.removeEventListener('message', receiveRequest, false);
    };
  }, [allowedOrigins, handleEvent]);

  // respond to requests using the registered handlers
  useEffect(() => {
    const consumeRequests = async () => {
      if (receivedRequestQueue.length > 0) {
        const consumedRequests = receivedRequestQueue.filter(event => {
          const { handler } = event.data;
          const handlerFn = handlers[handler as unknown as string];
          return !!handlerFn || event.data.args?.swallowIfNoHandler;
        });

        await Promise.all(
          consumedRequests.map(async event => {
            handleEvent(event);
          })
        );

        if (consumedRequests.length > 0) {
          setReceivedRequestQueue(prevQueue =>
            prevQueue.filter(r => !consumedRequests.includes(r))
          );
        }
      }
    };

    const consumeRequestsWithinLock = async () => {
      consumeRequestsMutex.lock();
      try {
        await consumeRequests();
      } finally {
        consumeRequestsMutex.unlock();
      }
    };

    consumeRequestsMutex.run(() => {
      consumeRequestsWithinLock();
    });
  }, [receivedRequestQueue, handlers, consumeRequestsMutex, handleEvent]);

  const registerHandler = useCallback(
    <R extends RPC<T>>(
      handler: R['request']['handler'],
      fn: (args: R['request']['args']) => Promise<R['response']>
    ) => {
      const h = handler as unknown as string;
      setHandlers(prevHandlers => ({ ...prevHandlers, [h]: fn }));

      return () =>
        setHandlers(prevHandlers => {
          if (prevHandlers[h] === fn) {
            const result = { ...prevHandlers };
            delete result[h];
            return result;
          }
          return prevHandlers;
        });
    },
    []
  );

  const sendRequest = useCallback(
    async <R extends RPC<T>>(
      handler: R['request']['handler'],
      args: R['request']['args'] = {}
    ) => {
      const id = newUuid();
      const deferred = new Deferred<R['response']>();

      if ((args as any)?.flushMessagingQueue) {
        setPendingResponses(prevPendingResponses => {
          const deferredIds = Object.keys(prevPendingResponses);
          deferredIds.forEach(deferredId => {
            prevPendingResponses[deferredId].reject({
              error: 'cancelled',
            });
          });
          return {};
        });
      }

      setPendingResponses(prevPendingResponses => ({
        ...prevPendingResponses,
        [id]: deferred,
      }));

      const requestData: RequestData<T> = {
        type: 'request',
        uuid: id,
        handler,
        args,
      };

      setSentRequestQueue(prevQueue => [...prevQueue, requestData]);
      return deferred.promise;
    },
    []
  );

  useEffect(() => {
    if (sentRequestQueue.length > 0 && target.window) {
      const consumedRequests = sentRequestQueue.filter(r => {
        // For all requests except the ready request we wait until the target is ready
        // so it picks up the message events. Ready requests are made until a response
        // is received so we don't wait for the target to be ready.
        if (r.handler === READY_HANDLER_NAME) return true;
        if (targetReady) return true;

        return false;
      });

      if (consumedRequests.length > 0) {
        consumedRequests.forEach(r => {
          target.window!.postMessage(r, target.origin);
        });

        setSentRequestQueue(prevQueue =>
          prevQueue.filter(r => !consumedRequests.includes(r))
        );
      }
    }
  }, [sentRequestQueue, target.window, target.origin, targetReady]);

  // store incoming responses
  useEffect(() => {
    const receiveResponse = (event: MessageEvent) => {
      if (!isResponse(event)) return;

      setResponseQueue(prevQueue => [...prevQueue, event]);
    };

    window.addEventListener('message', receiveResponse, false);
    return () => window.removeEventListener('message', receiveResponse, false);
  }, []);

  // resolve the requests using the responses
  useEffect(() => {
    if (responseQueue.length > 0) {
      const receivedResponses = responseQueue.map(event => {
        const { uuid, result, error } = event.data;

        const deferred = pendingResponses[uuid];
        // Ready requests may not receive a response if the target is not ready
        if (deferred) deferred.resolve({ result, error });

        return uuid;
      });

      setResponseQueue(prevQueue =>
        prevQueue.filter(e => !responseQueue.includes(e))
      );

      setPendingResponses(prevPendingResponses =>
        Object.entries(prevPendingResponses).reduce<{
          [uuid: string]: Deferred<ResponseMessage>;
        }>((sum, cur) => {
          const [uuid, value] = cur;
          if (!receivedResponses.includes(uuid)) sum[uuid] = value;
          return sum;
        }, {})
      );
    }
  }, [pendingResponses, responseQueue]);

  useEffect(() => {
    registerHandler<Ready<T>>('ready', async () => {
      return {};
    });
  }, [registerHandler]);

  useEffect(() => {
    if (targetReady) return;

    const timer = setInterval(() => {
      sendRequest<Ready<T>>('ready').then(() => {
        setTargetReady(true);
        clearInterval(timer);
      });
    }, 1000);
  }, [sendRequest, targetReady]);

  return (
    <Context.Provider value={{ registerHandler, sendRequest }}>
      {children}
    </Context.Provider>
  );
};
