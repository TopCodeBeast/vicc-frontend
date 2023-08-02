import { TypedDocumentNode, gql } from '@apollo/client';
import { faReceipt } from '@fortawesome/pro-regular-svg-icons';
import { Tooltip } from '@material-ui/core';
import { defineMessages } from 'react-intl';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

import { RequestReceipt_payment } from './__generated__/index.graphql';

type Props = {
  payment: RequestReceipt_payment;
};

const messages = defineMessages({
  enabled: {
    id: 'RequestReceipt.enabled',
    defaultMessage: 'Request a receipt',
  },
});

export const RequestReceipt = ({ payment }: Props) => {
  const { fiatReceiptUrl } = payment;
  const { formatMessage } = useIntlContext();

  if (!fiatReceiptUrl) return null;

  return (
    <Tooltip title={formatMessage(messages.enabled)}>
      <IconButton
        color="white"
        href={fiatReceiptUrl}
        icon={faReceipt}
        {...({ target: '_blank' } as any)}
      />
    </Tooltip>
  );
};

RequestReceipt.fragments = {
  payment: gql`
    fragment RequestReceipt_payment on Payment {
      id
      fiatReceiptUrl
    }
  ` as TypedDocumentNode<RequestReceipt_payment>,
};
