import { faApplePay, faGooglePay } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import link_co from '@sorare/core/src/assets/wallet/icon-link_co.svg';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { payment } from '@sorare/core/src/lib/glossary';

import { CanMakePaymentResult } from '@marketplace/components/buyActions/PaymentProvider/usePaymentRequest';

const Label = styled(Text16)`
  display: flex;
  gap: var(--intermediate-unit);
  align-items: center;
`;
const PaymentRequestIcon = styled(Text16)`
  border-radius: var(--half-unit);
  border: solid 1px var(--c-neutral-1000);
  padding: var(--half-unit) var(--intermediate-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-neutral-1000);
  width: calc(5 * var(--unit));
  font: var(--t-16);
`;

const LinkCo = styled.img`
  height: var(--double-and-a-half-unit);
  padding: var(--half-unit) 0;
  .dark-theme & {
    filter: invert(1);
  }
`;

type Props = {
  canMakePayment: CanMakePaymentResult | null;
};

export const PaymentRequest = ({ canMakePayment }: Props) => {
  if (!canMakePayment) return null;
  if (canMakePayment.googlePay)
    return (
      <Label as="span" color="var(--c-neutral-1000)">
        <PaymentRequestIcon>
          <FontAwesomeIcon
            size="lg"
            icon={faGooglePay}
            color="var(--c-neutral-1000)"
          />
        </PaymentRequestIcon>
        <FormattedMessage {...payment.googlePay} />
      </Label>
    );
  if (canMakePayment.applePay)
    return (
      <Label as="span" color="var(--c-neutral-1000)">
        <PaymentRequestIcon>
          <FontAwesomeIcon
            size="lg"
            icon={faApplePay}
            color="var(--c-neutral-1000)"
          />
        </PaymentRequestIcon>
        <FormattedMessage {...payment.applePay} />
      </Label>
    );
  return (
    <Label as="span" color="var(--c-neutral-1000)">
      <PaymentRequestIcon>
        <LinkCo src={link_co} alt="link" />
      </PaymentRequestIcon>
      <FormattedMessage {...payment.linkCo} />
    </Label>
  );
};

export default PaymentRequest;
