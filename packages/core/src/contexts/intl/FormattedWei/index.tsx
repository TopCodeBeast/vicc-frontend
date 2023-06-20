import { FormatNumberOptions } from 'react-intl';

import { useSentryContext } from 'contexts/sentry';
import { RoundingMode } from '@sorare/core/src/lib/wei';

import { useIntlContext } from '..';

interface Props extends FormatNumberOptions {
  value: string;
  roundingMode?: RoundingMode;
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

  return <span>{formatWei(value, roundingMode, rest)}</span>;
};

export default FormattedWei;
