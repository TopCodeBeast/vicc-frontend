import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import Switch from '@core/atoms/inputs/Switch';
import { Text14 } from '@core/atoms/typography';

const messages = defineMessages({
  saveCreditCard: {
    id: 'PaymentMethodPicker.saveCreditCard',
    defaultMessage: 'Save your credit card for later purchases',
  },
});

const SaveCreditCardRow = styled.div`
  display: flex;
  gap: var(--unit);
`;

export const SaveCreditCard = ({
  saveCreditCard,
  toggleSaveCreditCard,
  label = messages.saveCreditCard,
}: {
  saveCreditCard: boolean;
  toggleSaveCreditCard: () => void;
  label?: MessageDescriptor;
}) => {
  return (
    <SaveCreditCardRow>
      <Switch checked={saveCreditCard} onChange={toggleSaveCreditCard} />
      <Text14 color="var(--c-neutral-1000)">
        <FormattedMessage {...label} />
      </Text14>
    </SaveCreditCardRow>
  );
};

export default SaveCreditCard;
