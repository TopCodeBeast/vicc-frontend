import { gql } from '@apollo/client';
import styled from 'styled-components';

import american_express from 'assets/wallet/icon-american_express.png';
import apple_pay from 'assets/wallet/icon-apple_pay.png';
import diners_club from 'assets/wallet/icon-diners_club.png';
import google_pay from 'assets/wallet/icon-g_pay.png';
import jcb from 'assets/wallet/icon-jcb.png';
import mastercard from 'assets/wallet/icon-mastercard.png';
import unknown from 'assets/wallet/icon-unknown_cc.png';
import visa from 'assets/wallet/icon-visa.png';
import { Text16 } from '@sorare/core/src/atoms/typography';

import { CreditCard_creditCard } from './__generated__/index.graphql';

type Props = {
  creditCard: CreditCard_creditCard & { wallet?: { type: string } };
  selected: boolean;
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
const CreditCard = ({ creditCard, selected }: Props) => {
  const { brand, last4, wallet } = creditCard;
  const icon = wallet ? wallet.type : brand;

  return (
    <Root selected={selected}>
      <Picto src={brandImage[icon.toLocaleLowerCase()] || unknown} alt={icon} />
      <Text16 color="var(--c-neutral-1000)">••• {last4}</Text16>
    </Root>
  );
};

CreditCard.fragments = {
  creditCard: gql`
    fragment CreditCard_creditCard on CreditCard {
      last4
      brand
    }
  `,
};

export default CreditCard;
