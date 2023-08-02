import { faInfoCircle, faStar } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Caption, Text14, Text16, Title2 } from '@core/atoms/typography';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { fiatWallet, glossary } from '@core/lib/glossary';

import {
  LEARN_MORE_ABOUT_FIAT_WALLET,
  NOT_SUPPORTED_COUNTRIES_LINK,
} from '../externalLinks';
import { CreateFiatWalletSteps } from '../type';
import ReinsuranceItem from './ReinsuranceItem';
import { StaticCashBalance } from './StaticCashBalance';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--quadruple-unit);
  padding-top: var(--double-unit);
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
  width: 100%;
`;

const News = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: var(--unit);
`;

const Helper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  color: var(--c-neutral-600);
  background-color: var(--c-neutral-300);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
`;

const Center = styled.div`
  text-align: center;
`;

const StyledLink = styled.a`
  text-decoration: underline;
  color: var(--c-link);
`;

const news = [
  {
    id: 'fiat',
    title: (
      <FormattedMessage
        id="walletSetup.whatsNew.fiat.title"
        defaultMessage="Preferred & flexible currency"
      />
    ),
    desc: (
      <FormattedMessage
        id="walletSetup.whatsNew.fiat.desc"
        defaultMessage="Buy, sell, and receive rewards in cash. Or choose to use both cash and ETH."
      />
    ),
  },
  {
    id: 'deposit',
    title: (
      <FormattedMessage
        id="walletSetup.whatsNew.deposit.title"
        defaultMessage="Seamless deposits & withdrawals"
      />
    ),
    desc: (
      <FormattedMessage
        id="walletSetup.whatsNew.deposit.desc"
        defaultMessage="Add cash using a credit/debit card, or opt for a bank transfer to easily add or withdraw funds."
      />
    ),
  },
];
type Props = {
  setStep: (tab: CreateFiatWalletSteps) => void;
  onDismiss?: () => void;
};
export const WhatsNew = ({ setStep, onDismiss }: Props) => {
  const { canListAndTrade } = useFiatBalance();
  return (
    <Wrapper>
      <StaticCashBalance />
      <Center>
        <Title2>
          <FormattedMessage
            id="walletSetup.whatsNew.title"
            defaultMessage="Introducing Cash Wallet"
          />
        </Title2>
      </Center>
      <News>
        {news.map(({ id, title, desc }) => (
          <ReinsuranceItem key={id} title={title} desc={desc} icon={faStar} />
        ))}
      </News>
      {!canListAndTrade && (
        <Helper>
          <FontAwesomeIcon icon={faInfoCircle} />
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="walletSetup.whatsNew.helper"
              defaultMessage="Cards currently listed will continue to be sold for ETH. After activating your Cash Wallet, you can sell cards for cash or ETH."
            />
          </Text14>
        </Helper>
      )}
      <Center>
        <Text16 bold color="var(--c-link)">
          <StyledLink
            href={LEARN_MORE_ABOUT_FIAT_WALLET}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FormattedMessage
              id="walletSetup.whatsNew.learnMoreLink"
              defaultMessage="Learn more about Cash Wallet"
            />
          </StyledLink>
        </Text16>
      </Center>
      <Caption color="var(--c-neutral-600)">
        <FormattedMessage
          id="walletSetup.whatsNew.disclaimer"
          defaultMessage="Cash Wallet is powered by Mangopay. Availability may vary depending on your country of residence.{br} <link>Learn more</link>"
          values={{
            link: (...chunks: string[]) => {
              return (
                <StyledLink
                  target="_blank"
                  href={NOT_SUPPORTED_COUNTRIES_LINK}
                  rel="noopener noreferrer"
                >
                  {chunks}
                </StyledLink>
              );
            },
          }}
        />
      </Caption>
      <Actions>
        <Button
          color="blue"
          medium
          fullWidth
          onClick={() => setStep(CreateFiatWalletSteps.INTRO)}
        >
          <FormattedMessage
            {...(canListAndTrade
              ? glossary.continue
              : fiatWallet.activateCashWallet)}
          />
        </Button>
        {onDismiss && (
          <Button color="white" medium fullWidth onClick={onDismiss}>
            <FormattedMessage {...glossary.doItLater} />
          </Button>
        )}
      </Actions>
    </Wrapper>
  );
};
