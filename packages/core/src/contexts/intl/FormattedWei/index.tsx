import { FormatNumberOptions } from 'react-intl';

import { useSentryContext } from '@core/contexts/sentry';
import { RoundingMode } from '@core/lib/wei';

import { useIntlContext } from '..';

interface Props extends FormatNumberOptions {
  value: string;
  context: string;
}

export const FormattedWei = ({
  value,
  roundingMode,
  context,
  ...rest
}: Props) => {
  const { formatWei } = useIntlContext();

  const { sendSafeError } = useSentryContext();

  if (!value) {
    sendSafeError(
      new Error(`Received null value for FormattedWei, context: ${context}`)
    );
    return null;
  }

  //TODO
  return <span>{formatWei(value, roundingMode as any, rest)}</span>;
};

export default FormattedWei;
