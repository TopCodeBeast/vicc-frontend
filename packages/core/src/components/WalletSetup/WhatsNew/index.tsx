import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Caption, Title3 } from '@sorare/core/src/atoms/typography';
import createLink from '@sorare/core/src/atoms/typography/Link';
import { TERMS } from '@sorare/core/src/constants/routes';
import { glossary } from '@sorare/core/src/lib/glossary';

import ReinsuranceItem from '../ReinsuranceItem';
import { StaticCashBalance } from '../StaticCashBalance';
import { WalletSetupTab } from '../type';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--quadruple-unit);
`;

const News = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: var(--unit);
`;

const news = [
  {
    id: 'fiat',
    title: (
      <FormattedMessage
        id="walletSetup.whatsNew.fiat.title"
        defaultMessage="Familiar currency"
      />
    ),
    desc: (
      <FormattedMessage
        id="walletSetup.whatsNew.fiat.desc"
        defaultMessage="Buy and sell cards and receive tournament reward in your local currency (USD, GBP or EUR)."
      />
    ),
  },
  {
    id: 'deposit',
    title: (
      <FormattedMessage
        id="walletSetup.whatsNew.deposit.title"
        defaultMessage="Effortless deposits"
      />
    ),
    desc: (
      <FormattedMessage
        id="walletSetup.whatsNew.deposit.desc"
        defaultMessage="Add cash directly into your wallet using a credit/debit card, ApplePay and Google Pay or ACH."
      />
    ),
  },
  {
    id: 'withdrawal',
    title: (
      <FormattedMessage
        id="walletSetup.whatsNew.withdrawal.title"
        defaultMessage="Flexible withdrawals"
      />
    ),
    desc: (
      <FormattedMessage
        id="walletSetup.whatsNew.withdrawal.desc"
        defaultMessage="Withdraw directly into your bank account via ACH."
      />
    ),
  },
];
type Props = {
  setWalletSetupTab: (tab: WalletSetupTab) => void;
};
export const WhatsNew = ({ setWalletSetupTab }: Props) => {
  return (
    <Wrapper>
      <StaticCashBalance />
      <Title3>
        <FormattedMessage
          id="walletSetup.whatsNew.title"
          defaultMessage="What’s new with cash balance?"
        />
      </Title3>
      <News>
        {news.map(({ id, title, desc }) => (
          <ReinsuranceItem key={id} title={title} desc={desc} icon={faStar} />
        ))}
      </News>
      <Caption color="var(--c-neutral-600)">
        <FormattedMessage
          id="walletSetup.whatsNew.disclaimer"
          defaultMessage="Personal information like full name and email address might be required the first time you deposit, sell or withdraw from your cash balance. <link>Learn more</link>"
          values={{ link: createLink(TERMS) }}
        />
      </Caption>
      <Button
        color="blue"
        medium
        fullWidth
        onClick={() => setWalletSetupTab(WalletSetupTab.SETUP)}
      >
        <FormattedMessage {...glossary.continue} />
      </Button>
    </Wrapper>
  );
};
