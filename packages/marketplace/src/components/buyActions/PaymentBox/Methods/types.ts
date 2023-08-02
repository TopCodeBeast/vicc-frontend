export enum PaymentMethod {
  ETH_WALLET = 'eth_wallet',
  FIAT_WALLET = 'fiat_wallet',
  NEW_CREDIT_CARD = 'new_credit_card',
  NEW_MANGOPAY_CREDIT_CARD = 'new_mangopay_credit_card',
  PAYMENT_REQUEST = 'payment_request',
}

export type CrediCardPaymentMethodSuffix = `credit_card_`;
export type CrediCardPaymentMethod = `${CrediCardPaymentMethodSuffix}${string}`;

export type OrderedPaymentMethod = PaymentMethod | CrediCardPaymentMethod;
