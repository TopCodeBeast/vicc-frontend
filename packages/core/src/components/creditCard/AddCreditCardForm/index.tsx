import {
  faCcAmex,
  faCcDinersClub,
  faCcMastercard,
  faCcVisa,
} from '@fortawesome/free-brands-svg-icons';
import { faCreditCardAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import styled, { css } from 'styled-components';

import { CreditCardType } from '__generated__/globalTypes';
import { Text14 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

import SaveCreditCard from '../SaveCreditCard';
import {
  useCreditCardDetails,
  useCreditCardDetailsCallback,
} from './react-credit-cards/useCreditCardDetails';
import {
  cardTypesMap,
  clearNumber,
  formatExpirationDate,
} from './react-credit-cards/utils/cardHelpers';

export type CreditCardFormResult = {
  firstName: string;
  lastName: string;
  cardNumber: string;
  cardCvx: string;
  cardExpirationDate: string;
  cardType: CreditCardType;
};

type Props = {
  saveCreditCard: boolean;
  toggleSaveCreditCard: () => void;
  visible: boolean;
  onChange: (card: CreditCardFormResult) => void;
  error?: string[];
  saveCreditCardLabel?: MessageDescriptor;
};

const creditCardInputPlaceholders = defineMessages({
  number: {
    id: 'CreditCardInputPlaceholders.number',
    defaultMessage: 'Card number',
  },
  cvc: {
    id: 'CreditCardInputPlaceholders.cvc',
    defaultMessage: 'CVC',
  },
  expiry: {
    id: 'CreditCardInputPlaceholders.expiry',
    defaultMessage: 'MM/YY',
  },
});

const messages = defineMessages({
  invalidCreditCart: {
    id: 'PaymentMethodPicker.invalidCreditCard',
    defaultMessage: 'The credit card entered is invalid',
  },
});

const Root = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  ${({ visible }) =>
    !visible
      ? css`
          display: none;
        `
      : ''};
`;

const inputStyle = css`
  padding: var(--intermediate-unit);
  border: 1px solid var(--c-neutral-400);
  border-radius: var(--unit);
`;

const TextInput = styled.input`
  background-color: transparent;
  font-weight: 400;
  font-style: normal;
  font-size: 15px;
  width: 100%;
`;

const CardNumberInput = styled.input`
  min-width: 0;
  margin-right: var(--half-unit);
`;

const CardInputs = styled.div`
  ${inputStyle}
  align-items: center;
  max-width: 100%;
  display: flex;
  input {
    border: none;
    background-color: transparent;
    font-weight: 400;
    font-style: normal;
    font-size: 15px;

    &[name='number'] {
      flex-grow: 1;
      margin-left: var(--unit);
    }
  }
`;

const getCardBrandIcon = (cardIssuer: string) => {
  if (cardTypesMap.visaelectron.includes(cardIssuer)) return faCcVisa;
  if (cardTypesMap.masterCard.includes(cardIssuer)) return faCcMastercard;
  if (cardTypesMap.amex.includes(cardIssuer)) return faCcAmex;
  if (cardTypesMap.dinersclub.includes(cardIssuer)) return faCcDinersClub;
  return null;
};

export const AddCreditCardForm = ({
  visible,
  onChange,
  error: errors,
  saveCreditCard,
  toggleSaveCreditCard,
  saveCreditCardLabel,
}: Props) => {
  const { formatMessage } = useIntl();
  const [number, setNumber] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const cvcInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const expiryInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<boolean | undefined>(false);
  const [valid, setValid] = useState<boolean>(false);

  const onNumberChange = useCallback<useCreditCardDetailsCallback>(
    (type, isValid) => {
      setValid(isValid);
    },
    [setValid]
  );

  const {
    cardIssuer,
    cvcMaxLength,
    cardNumber,
    cardType,
    cardOptions: { maxLength },
  } = useCreditCardDetails(number, onNumberChange);

  const onExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpirationDate(e.target.value));
    if (e.target.value.length === 5) {
      if (cvcInputRef.current) cvcInputRef.current.focus();
    }
  };

  const onCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
    if (maxLength && clearNumber(e.target.value).length >= maxLength) {
      if (expiryInputRef.current) expiryInputRef.current.focus();
    }
  };

  useEffect(() => {
    onChange({
      firstName,
      lastName,
      cardNumber: clearNumber(number),
      cardCvx: cvc,
      cardExpirationDate: clearNumber(expiry),
      cardType,
    });
  }, [valid, number, expiry, cvc, cardType, firstName, lastName, onChange]);

  const cardIcon = getCardBrandIcon(cardIssuer);

  return (
    // hide the component with CSS instead of unmounting it from the DOM to keep the underlying state
    <Root aria-hidden={!visible} visible={visible}>
      <div>
        {!focused && (!errors || errors.length === 0) && number.length > 0 && (
          <Text14 color="var(--c-red-600)">
            {!errors && !valid && (
              <FormattedMessage {...messages.invalidCreditCart} />
            )}
          </Text14>
        )}
        {errors && errors.length > 0 && (
          <Text14 color="var(--c-red-600)">{errors.map(error => error)}</Text14>
        )}
        <CardInputs>
          <TextInput
            type="text"
            placeholder={formatMessage(glossary.firstName)}
            name="firstName"
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value);
            }}
          />
          <TextInput
            type="text"
            name="lastName"
            placeholder={formatMessage(glossary.lastName)}
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
            }}
          />
        </CardInputs>
      </div>
      <div>
        <CardInputs>
          <FontAwesomeIcon
            color={cardIcon ? 'var(--c-neutral-600)' : 'currentColor'}
            size="lg"
            icon={cardIcon || faCreditCardAlt}
          />
          <CardNumberInput
            type="tel"
            name="number"
            className="form-control"
            placeholder={formatMessage(creditCardInputPlaceholders.number)}
            pattern="[\d\s]{16,22}"
            value={cardNumber}
            required
            onChange={onCardNumberChange}
            onBlur={() => setFocused(undefined)}
            onFocus={() => setFocused(true)}
          />
          <input
            type="text"
            ref={expiryInputRef}
            value={expiry}
            size={6}
            placeholder={formatMessage(creditCardInputPlaceholders.expiry)}
            pattern="\d\d/\d\d"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(true)}
            onChange={onExpiryDateChange}
          />
          <input
            type="cvc"
            ref={cvcInputRef}
            placeholder={formatMessage(creditCardInputPlaceholders.cvc)}
            value={cvc}
            maxLength={cvcMaxLength}
            size={4}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(undefined)}
            onChange={e => setCvc(e.target.value)}
          />
        </CardInputs>
      </div>
      <div>
        <SaveCreditCard
          saveCreditCard={saveCreditCard}
          toggleSaveCreditCard={toggleSaveCreditCard}
          label={saveCreditCardLabel}
        />
      </div>
    </Root>
  );
};

export default AddCreditCardForm;
