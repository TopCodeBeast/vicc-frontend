import { faCreditCardAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

const CreditCardIcon = styled(Text16)`
  border-radius: var(--half-unit);
  border: 1px solid var(--c-neutral-1000);
  background-color: var(--c-neutral-1000);
  padding: var(--half-unit) var(--intermediate-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(5 * var(--unit));
  color: var(--c-neutral-100);
  .dark-theme & {
    color: var(--c-neutral-300);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

export const NewCreditCard = () => {
  return (
    <Row>
      <CreditCardIcon>
        <FontAwesomeIcon size="lg" icon={faCreditCardAlt} />
      </CreditCardIcon>
      <Text16 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="NewPaymentBox.methods.addCreditCard"
          defaultMessage="Credit / Debit card"
        />
      </Text16>
    </Row>
  );
};
export default NewCreditCard;
