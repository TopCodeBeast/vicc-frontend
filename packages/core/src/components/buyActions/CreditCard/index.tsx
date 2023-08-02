import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import american_express from '@core/assets/wallet/icon-american_express.png';
import apple_pay from '@core/assets/wallet/icon-apple_pay.png';
import diners_club from '@core/assets/wallet/icon-diners_club.png';
import google_pay from '@core/assets/wallet/icon-g_pay.png';
import jcb from '@core/assets/wallet/icon-jcb.png';
import mastercard from '@core/assets/wallet/icon-mastercard.png';
import unknown from '@core/assets/wallet/icon-unknown_cc.png';
import visa from '@core/assets/wallet/icon-visa.png';
import { Text14, Text16 } from '@core/atoms/typography';
import { Color } from '@core/style/types';

import { CreditCard_creditCard } from './__generated__/index.graphql';

type Props = {
  creditCard: CreditCard_creditCard & { wallet?: { type: string } };
  selected: boolean;
  suffixText?: ReactNode;
  color?: Color;
};

const brandImage: { [key: string]: string } = {
  american_express,
  diners_club,
  jcb,
  mastercard,
  visa,
  apple_pay,
  google_pay,
};

const Root = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-brand-600);
  .dark-theme & {
    color: var(--c-neutral-1000);
  }
`;

const Picto = styled.img`
  height: 30px;
  max-width: calc(5 * var(--unit));
  object-fit: cover;
  border-radius: var(--half-unit);
`;
const CreditCard = ({
  creditCard,
  selected,
  color = 'var(--c-neutral-1000)',
  suffixText,
}: Props) => {
  const { brand, last4, wallet } = creditCard;
  const icon = wallet ? wallet.type : brand;

  return (
    <Root selected={selected}>
      <Picto src={brandImage[icon.toLocaleLowerCase()] || unknown} alt={icon} />
      <Text16 color={color}>••• {last4}</Text16>
      {suffixText && <Text14 color={color}>{suffixText}</Text14>}
    </Root>
  );
};

CreditCard.fragments = {
  creditCard: gql`
    fragment CreditCard_creditCard on CreditCard {
      last4
      brand
    }
  ` as TypedDocumentNode<CreditCard_creditCard>,
};

export default CreditCard;
