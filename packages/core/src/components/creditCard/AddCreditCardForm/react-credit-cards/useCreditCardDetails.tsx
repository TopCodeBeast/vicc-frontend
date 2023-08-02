import { useCallback, useEffect, useMemo, useState } from 'react';

import { CreditCardType } from '__generated__/globalTypes';

import {
  cardTypesMap,
  getCardType,
  setInitialValidCardTypes,
  validateLuhn,
} from './utils/cardHelpers';

export type Focused = 'name' | 'number' | 'expiry' | 'cvc' | '';

const getCardOptions = (number: string | number, validCardTypes: any) => {
  let updatedIssuer = 'unknown';

  if (number) {
    const validatedIssuer = getCardType(number);
    if (validCardTypes.includes(validatedIssuer.type)) {
      updatedIssuer = validatedIssuer.type;
      return {
        issuer: updatedIssuer,
        maxLength: Math.max(...validatedIssuer.lengths),
        code: validatedIssuer.code,
      };
    }
  }

  return {
    issuer: 'unknow',
    maxLength: 16,
    code: {
      size: 3,
    },
  };
};

export type useCreditCardDetailsCallback = (
  type: {
    issuer: string;
    maxLength: number;
  },
  isValid: boolean
) => void;

export const useCreditCardDetails = (
  number: string,
  callback?: useCreditCardDetailsCallback
) => {
  const [cardTypes, setCardTypes] = useState(setInitialValidCardTypes());
  const validCardTypes = useMemo(() => {
    return cardTypes;
  }, [cardTypes]);

  const cardOptions = useMemo(() => {
    return getCardOptions(number, validCardTypes);
  }, [number, validCardTypes]);

  const cardIssuer = useMemo(() => cardOptions.issuer, [cardOptions.issuer]);
  const cardType: CreditCardType = useMemo(() => {
    if (cardTypesMap.amex.includes(cardIssuer)) return CreditCardType.AMEX;
    if (cardTypesMap.maestro.includes(cardIssuer))
      return CreditCardType.MAESTRO;
    return CreditCardType.CB_VISA_MASTERCARD;
  }, [cardIssuer]);

  const cvcMaxLength = cardOptions.code.size;

  const cardNumber = useMemo(() => {
    const { maxLength } = cardOptions;
    let nextNumber = String(number).replace(/[A-Za-z]| /g, '');

    if (Number.isNaN(parseInt(nextNumber, 10))) {
      nextNumber = '';
    }

    if (
      cardTypesMap.amex.includes(cardIssuer) ||
      cardTypesMap.dinersclub.includes(cardIssuer)
    ) {
      const format = [0, 4, 10];
      nextNumber = `${nextNumber.slice(
        format[0],
        format[1]
      )} ${nextNumber.substring(format[1], format[2])} ${nextNumber.slice(
        format[2],
        maxLength
      )}`;
    } else if (nextNumber.length > 16) {
      const format = [0, 4, 8, 12];
      nextNumber = `${nextNumber.substring(
        format[0],
        format[1]
      )} ${nextNumber.slice(format[1], format[2])} ${nextNumber.slice(
        format[2],
        format[3]
      )} ${nextNumber.slice(format[3], maxLength)}`;
    } else {
      for (let i = 1; i < maxLength / 4; i += 1) {
        const space_index = i * 4 + (i - 1);
        nextNumber = `${nextNumber.slice(0, space_index)} ${nextNumber.slice(
          space_index
        )}`;
      }
    }

    return nextNumber.trim();
  }, [cardOptions, cardIssuer, number]);

  const updateValidCardTypes = useCallback(() => {
    const initialValidCardTypes = setInitialValidCardTypes();
    setCardTypes(initialValidCardTypes);
  }, []);

  useEffect(() => {
    /* istanbul ignore else */
    if (typeof callback === 'function') {
      callback(cardOptions, validateLuhn(String(number)));
    }

    const initialValidCardTypes = setInitialValidCardTypes();
    if (initialValidCardTypes.toString() !== cardTypes.toString()) {
      updateValidCardTypes();
    }
  }, [
    callback,
    cardOptions,
    cardNumber,
    updateValidCardTypes,
    number,
    cardTypes,
  ]);

  return {
    cardOptions,
    cardIssuer,
    cardType,
    cvcMaxLength,
    cardNumber,
  };
};
