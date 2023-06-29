import { SeverityLevel, captureException, captureMessage } from '@sentry/react';
import { isError } from '@sentry/utils';

interface WithMessage {
  message: string;
}

interface WithCode {
  code: number | string;
}

export const wrapError = (err: any) => {
  if (err instanceof Error) return err;
  try {
    return new Error(`Unexpected error: ${err.toString()}`);
  } catch (e) {
    return new Error(`Unexpected error with unexpected format: ${typeof err}`);
  }
};

const hasMessage = (err: unknown): err is WithMessage => {
  if (!err || !(err as any).message) {
    return false;
  }
  return typeof (err as any).message === 'string';
};

const hasCode = (err: unknown): err is WithCode => {
  if (!err || !(err as any).code) {
    return false;
  }
  const { code } = err as any;
  return typeof code === 'string' || typeof code === 'number';
};

const buildMessage = (err: WithMessage): string => {
  if (hasCode(err)) {
    return `${err.code}: ${err.message}`;
  }
  return err.message;
};

export const sendSafeError = (err: unknown) => {
  if (isError(err) || !hasMessage(err)) {
    captureException(err);
  } else {
    captureMessage(buildMessage(err), 'error' as SeverityLevel);
  }
};
