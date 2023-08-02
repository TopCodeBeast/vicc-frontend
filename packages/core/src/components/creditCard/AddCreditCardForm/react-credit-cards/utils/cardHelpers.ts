import creditCardType, { types as cardTypes } from 'credit-card-type';
import luhn from 'luhn';

import { dankort, laser, visaElectron } from './cardTypes';

/**
 * Check if a credit card number is valid using the Luhn algorithm
 */
export const validateLuhn = luhn.validate;

/**
 * Given a credit card number in the format (XXXX XXXX XXXX...) return it as a string without any spaces
 */
export const sanitizeNumber = (number: string | number) =>
  number.toString().trim().replace(' ', '');

/**
 * Return the issuer of a given credit card number or `unknown` if the issuer can't be identified
 */
export const getCardType = (cardNumber: string | number) => {
  const potentialCardTypes = creditCardType(sanitizeNumber(cardNumber));

  if (potentialCardTypes.length === 1) {
    const firstResult = potentialCardTypes.shift();
    if (firstResult) return firstResult;
  }

  return { type: 'unknown', lengths: [19], code: { size: 3 } };
};

/**
 * Configure the credit card types supported and return an array of valid types
 */
export const setInitialValidCardTypes = () => {
  creditCardType.updateCard(cardTypes.MAESTRO, {
    patterns: [
      493698,
      [5000, 5018] as any,
      [502000, 506698],
      [506779, 508999],
      [56, 59],
      63,
      67,
      6,
    ],
  });

  creditCardType.updateCard(cardTypes.HIPERCARD, {
    patterns: [384100, 384140, 384160, 606282, 637095, 637568],
  });

  creditCardType.addCard(dankort);
  creditCardType.addCard(laser);
  creditCardType.addCard(visaElectron);

  return Object.values(cardTypes).concat([
    'dankort',
    'laser',
    'visa-electron',
  ] as any);
};

/**
 * Provides a map of patterns to match for some card types
 */
export const cardTypesMap = {
  amex: ['amex', 'americanexpress', 'american-express'],
  dinersclub: ['diners', 'dinersclub', 'diners-club'],
  visaelectron: ['visaelectron', 'visa-electron', 'visa'],
  masterCard: ['mastercard'],
  maestro: ['maestro'],
};

/**
 * Given a string, it removes all char differents from number
 */
export const clearNumber = (value = '') => {
  return value.replace(/\D+/g, '');
};

/**
 * Format expiration date to follow "MM/YY" format and removed unwanted char
 */
export function formatExpirationDate(value: string) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}
