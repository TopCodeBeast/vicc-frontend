import { Input } from '@material-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { ChangeEvent, useContext, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import poweredByStripe from '@sorare/core/src/assets/powered_by_stripe.png';
import { Text16 } from '@sorare/core/src/atoms/typography';
import SaveCreditCard from '@sorare/core/src/components/creditCard/SaveCreditCard';
import { DarkThemeContext } from '@sorare/core/src/routing/DarkTheme';

import { usePaymentContext } from '@marketplace/components/buyActions/Context';

const creditCardStyle = (isDarkTheme: boolean) => ({
  // this style is used inside of a stripe iframe and does not have access to our css variables
  style: {
    base: {
      fontFamily: 'apercu-pro, system-ui, sans-serif',
      fontWeight: 400,
      fontStyle: 'normal',
      padding: '10px',
      fontSize: '15px',
      width: '100%',
      color: isDarkTheme ? 'white' : 'black',
      '::placeholder': {
        color: '#72747f',
      },
    },
    invalid: {
      color: '#e13232',
      iconColor: '#e13232',
    },
  },
  disableLink: true,
});

type Props = {
  visible: boolean;
};

const messages = defineMessages({
  payWith: {
    id: 'CreditCardPicker.payWith',
    defaultMessage: 'Pay with',
  },
  holderName: {
    id: 'AddCreditCardForm.holderName',
    defaultMessage: 'Displayed name on the credit card',
  },
  error: {
    id: 'CreditCardPicker.error',
    defaultMessage: 'Error: {error}',
  },
});

const Root = styled.div<{ visible: boolean }>`
  ${({ visible }) =>
    !visible
      ? css`
          display: none;
        `
      : ''}
`;

const HolderName = styled(Input)<{ error: boolean }>`
  padding: var(--unit) var(--double-unit);
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid var(--c-neutral-400);
  border-radius: var(--unit);
  ${({ error }) =>
    error
      ? css`
          color: var(--c-red-600);
        `
      : ''}
`;

const CardForm = styled(CardElement)`
  margin-bottom: 20px;
  padding: var(--double-unit);
  border: 1px solid var(--c-neutral-400);
  border-radius: var(--unit);
`;

const PoweredByStripe = styled.img`
  margin-top: 20px;
  align-self: center;
  .dark-theme & {
    filter: grayscale(100%) invert(1);
  }
`;

export const AddStripeCreditCardForm = ({ visible }: Props) => {
  const { setPaymentMethod, saveCreditCard, toggleSaveCreditCard } =
    usePaymentContext();
  const { formatMessage } = useIntl();
  const elements = useElements();
  const stripe = useStripe();
  const [holderName, setHolderName] = useState<string>('');

  const [cardError, setCardError] = useState<string | undefined>('');
  const [ready, setReady] = useState(false);
  const { withinDarkTheme } = useContext(DarkThemeContext);
  const ccStyle = creditCardStyle(withinDarkTheme);

  const handleNewCreditCardAsPaymentMethod = () => {
    if (!elements || !stripe || !holderName) return;
    const cardElement = elements.getElement(CardElement)!;
    setPaymentMethod({
      card: cardElement,
      billing_details: {
        name: holderName,
        email: null,
        phone: null,
        address: null,
      },
    });
  };

  const handleNewCreditCardInputChange = (
    event: StripeCardElementChangeEvent
  ) => {
    // On first input user can submit without having triggered the event
    setReady(true);
    setCardError(event.error?.message);
    handleNewCreditCardAsPaymentMethod();
  };

  const handleHolderNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cardHolder = event.target.value as string;
    setHolderName(cardHolder);
    handleNewCreditCardAsPaymentMethod();
  };

  return (
    // hide the component with CSS instead of unmounting it from the DOM to keep the underlying state
    <Root aria-hidden={!visible} visible={visible}>
      {!!cardError && (
        <Text16 color="var(--c-red-600)">
          <FormattedMessage {...messages.error} values={{ error: cardError }} />
        </Text16>
      )}
      <div>
        <HolderName
          type="text"
          autoFocus
          value={holderName}
          onChange={handleHolderNameChange}
          placeholder={formatMessage(messages.holderName)}
          error={ready && !holderName.length}
          disableUnderline
          name="cc-name"
        />
        <CardForm
          id="card-element"
          options={ccStyle}
          onChange={handleNewCreditCardInputChange}
        />
        <SaveCreditCard
          saveCreditCard={saveCreditCard}
          toggleSaveCreditCard={toggleSaveCreditCard}
        />
        <PoweredByStripe src={poweredByStripe} alt="Powered by Stripe" />
      </div>
    </Root>
  );
};

export default AddStripeCreditCardForm;
