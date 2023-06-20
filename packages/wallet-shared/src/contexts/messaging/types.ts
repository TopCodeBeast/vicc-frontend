export const READY_HANDLER_NAME = 'ready' as const;
export type ReadyHandler = typeof READY_HANDLER_NAME;

export interface RequestMessage<T> {
  handler: T | ReadyHandler;
  args?: Record<string, any>;
}

export interface ResponseMessage {
  result?: any;
  error?: any;
}

export interface RPC<T> {
  request: RequestMessage<T>;
  response: ResponseMessage;
}

export interface RequestData<T> extends RequestMessage<T> {
  type: 'request';
  uuid: string;
}

export interface Request<T> extends MessageEvent {
  data: RequestData<T>;
}

export interface ResponseData extends ResponseMessage {
  type: 'response';
  uuid: string;
}

export interface Response extends MessageEvent {
  data: ResponseData;
}

export function isRequest<T>(event: MessageEvent): event is Request<T> {
  return event.data.type === 'request';
}

export function isResponse(event: MessageEvent): event is Response {
  return event.data.type === 'response';
}

export interface MessagingContext<T> {
  registerHandler: <R extends RPC<T>>(
    handler: R['request']['handler'],
    fn: (args: R['request']['args']) => Promise<R['response']>
  ) => () => void;
  sendRequest: <R extends RPC<T>>(
    handler: R['request']['handler'],
    args: R['request']['args']
  ) => Promise<R['response']>;
}

export interface Ready<T> extends RPC<T> {
  request: {
    handler: ReadyHandler;
  };
  response: Record<string, unknown>;
}
