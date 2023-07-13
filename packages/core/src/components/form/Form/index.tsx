import isEqual from 'lodash.isequal';
import {
  FormEvent,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import LoadingButton, {
  Props as LoadingButtonProps,
} from '@core/atoms/buttons/LoadingButton';
import { useIntlContext } from '@core/contexts/intl';
import { glossary } from '@core/lib/glossary';
import { GraphQLError } from '@core/lib/gql';
import humanize from '@core/lib/humanize';
import { toCamelCase } from '@core/lib/toCamelCase';

import ConfirmDialog from '../ConfirmDialog';
import ErrorField from './Error';
import FormContextProvider, { RegisterFieldOptions } from './context';

interface FormatErrorOptions {
  withAttribute: boolean;
  formatErrorMessage: (message: string, code?: number | null) => string;
}

export type SubmitButtonProps = Omit<LoadingButtonProps, 'loading'>;

interface Props<R> {
  className?: string;
  render: (
    FormError: FunctionComponent<{ code?: boolean }>,
    SubmitButton: FunctionComponent<SubmitButtonProps>,
    submitting: boolean
  ) => ReactNode;
  onSubmit: (
    values: any,
    onResult: (result: R) => void,
    onCancel: () => void | undefined
  ) => void;
  onSuccess: (result: R) => void;
  onError?: (result: R) => void;
  errorMessages?: Record<string, MessageDescriptor>;
  askForConfirmation?: boolean;
  confirmationMessage?: ReactNode;
  dialogTitle?: ReactNode;
  dialogSubtitle?: ReactNode;
  dialogCta?: ReactNode;
  dialogCtaProps?: SubmitButtonProps;
  autoComplete?: boolean;
  onChange?: (values: any, submit: () => void) => void;
}

interface ErrorHandler<R, E> {
  getErrors: (result: R) => readonly E[] | null;
  formatError: (error: E, options: FormatErrorOptions) => string | null;
  getField: (field: E) => string | undefined | null;
}

interface FieldOptions {
  onChange: (value: string) => void;
  onError: (error: string | null) => void;
}

/**
 * The Form class is used to factorize forms code and better handle errors.
 * A Form defines a FormContext that is used by it children Fields to register themselves.
 * This registering allows the form to redistribute errors that are linked to fields directly to them.
 *
 * When rendering, Form also provides:
 * - an Error element with any error that could not be linked to a specific field.
 * - a Submit button that is disabled when the form is being submitted.
 */
export const Form = <R extends { error?: string }, E>({
  className = '',
  render,
  onSubmit,
  onSuccess,
  onError,
  errorMessages,
  askForConfirmation,
  confirmationMessage,
  dialogTitle,
  dialogSubtitle,
  dialogCta,
  dialogCtaProps,
  autoComplete = false,
  errorHandler: { getErrors, getField, formatError },
  onChange,
}: Props<R> & { errorHandler: ErrorHandler<R, E> }) => {
  const [fields, setFields] = useState<{ [name: string]: FieldOptions }>({});
  const [values, setValues] = useState<{ [name: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { formatMessage } = useIntlContext();
  const [promptConfirm, setPromptConfirm] = useState(false);
  const [issuedFormState, setIssuedFormState] = useState<{
    [name: string]: string;
  } | null>(null);

  const handleChange =
    (name: string) =>
    (event: {
      target: {
        value: any;
      };
    }) => {
      // make sure we use a value of fields that is up-to-date
      setFields(currentFields => {
        const opts = currentFields[name];

        if (!opts) {
          throw new Error(
            `Unexpected field ${name}! Fields should be registered.`
          );
        }
        const { value } = event.target;
        setValues(vals => ({
          ...vals,
          [name]: value,
        }));
        opts.onChange(value);
        return currentFields;
      });
    };

  const formatErrorMessage = useCallback(
    (message: string, code?: number | null) => {
      return code && errorMessages && code in errorMessages
        ? formatMessage(errorMessages[code])
        : message;
    },
    [errorMessages, formatMessage]
  );

  const setErrors = useCallback(
    (errors: readonly any[]) => {
      const orphanErrors: E[] = [];
      errors.forEach(e => {
        const field = getField(e);
        const opts = field && fields[field];
        if (opts) {
          opts.onError(
            formatError(e, {
              withAttribute: false,
              formatErrorMessage,
            })
          );
        } else {
          orphanErrors.push(e);
        }
      });
      if (orphanErrors.length > 0) {
        setError(
          orphanErrors
            .map(err =>
              formatError(err, { formatErrorMessage, withAttribute: false })
            )
            .join(' ')
        );
      }
    },
    [fields, formatError, formatErrorMessage, getField]
  );

  const onResult = useCallback(
    (result: R) => {
      setSubmitting(false);
      const errors = getErrors(result);

      if (errors) {
        setErrors(errors);
        if (onError) onError(result);
      } else if (result.error) {
        setError(result.error);
        if (onError) onError(result);
      } else {
        onSuccess(result);
      }
    },
    [getErrors, onError, onSuccess, setErrors]
  );

  const onCancel = () => {
    setSubmitting(false);
  };

  const formState = useCallback(
    () =>
      Object.keys(fields).reduce<{ [field: string]: string }>((acc, field) => {
        acc[field] = values[field];
        return acc;
      }, {}),
    [fields, values]
  );

  const resetErrors = useCallback(() => {
    Object.values(fields).forEach(({ onError: onErr }) => onErr(null));
  }, [fields]);

  const handleConfirm = useCallback(() => {
    setError(null);
    setSubmitting(true);
    setPromptConfirm(false);

    resetErrors();
    onSubmit(formState(), onResult, onCancel);
  }, [formState, onResult, onSubmit, resetErrors]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (askForConfirmation) {
        setPromptConfirm(true);
      } else {
        handleConfirm();
      }
    },
    [askForConfirmation, handleConfirm]
  );

  const registerField = useCallback(
    (name: string, { defaultValue, ...opts }: RegisterFieldOptions) => {
      setFields(currentFields => ({
        ...currentFields,
        [name]: opts,
      }));
      setValues(currentValues => ({
        ...currentValues,
        [name]: defaultValue || '',
      }));
    },
    []
  );

  useEffect(() => {
    const currentFormState = formState();
    if (
      onChange &&
      !submitting &&
      !isEqual(currentFormState, issuedFormState)
    ) {
      onChange(currentFormState, handleConfirm);
      setIssuedFormState(currentFormState);
    }
  }, [onChange, formState, handleConfirm, submitting, issuedFormState]);

  const FormError = (props: any) => <ErrorField error={error} {...props} />;
  const Submit = (props: SubmitButtonProps) => (
    <LoadingButton
      type="submit"
      color="blue"
      loading={submitting}
      medium
      {...props}
    />
  );
  return (
    <FormContextProvider
      value={{
        registerField,
        handleChange,
      }}
    >
      <form
        className={className}
        autoComplete={autoComplete ? 'on' : undefined}
        onSubmit={handleSubmit}
      >
        {askForConfirmation && (
          <ConfirmDialog
            open={promptConfirm}
            onConfirm={handleConfirm}
            onClose={() => setPromptConfirm(false)}
            {...(dialogTitle && { title: dialogTitle })}
            {...(dialogSubtitle && { subtitle: dialogSubtitle })}
            {...(dialogCtaProps && { ctaProps: dialogCtaProps })}
            message={
              confirmationMessage || (
                <FormattedMessage
                  id="Form.confirm"
                  defaultMessage="Are you sure?"
                />
              )
            }
            cta={dialogCta || formatMessage(glossary.yes)}
          />
        )}
        {render(FormError, Submit, submitting)}
      </form>
    </FormContextProvider>
  );
};

export interface GraphQLResult {
  error?: string;
  errors?: readonly GraphQLError[] | null;
}

const graphqlErrorHandler: ErrorHandler<GraphQLResult, GraphQLError> = {
  getErrors: result =>
    result.errors && result.errors.length > 0 ? result.errors : null,
  formatError: (error, options: FormatErrorOptions) => {
    const { withAttribute, formatErrorMessage } = options;
    return `${
      withAttribute ? `${error.path ? error.path[1] : ''} ` : ''
    }${formatErrorMessage(error.message, error.code)}`;
  },
  getField: error => error.path?.[1],
};

type RestError = [string, string];

export interface RestResult {
  error?: string;
  errors?: { [key: string]: string };
}

const restErrorHandler: ErrorHandler<RestResult, RestError> = {
  getErrors: result =>
    result.errors && Object.keys(result.errors).length > 0
      ? Object.entries<string>(result.errors)
      : null,

  formatError: (error, options) => {
    const { withAttribute } = options || { withAttribute: true };
    const [att, message] = error;
    return `${withAttribute ? `${humanize(att)} ` : ''}${message}`;
  },

  getField: error => toCamelCase(error[0]),
};

export const GraphqlForm = (props: Props<GraphQLResult>) => (
  <Form {...props} errorHandler={graphqlErrorHandler} />
);

export const RestForm = (props: Props<RestResult>) => (
  <Form {...props} errorHandler={restErrorHandler} />
);

export { default as Field } from './Field';
export { default as TextField } from './TextField';
export { default as SwitchField } from './SwitchField';
export { default as TextFieldWithConversion } from './TextFieldWithConversion';
