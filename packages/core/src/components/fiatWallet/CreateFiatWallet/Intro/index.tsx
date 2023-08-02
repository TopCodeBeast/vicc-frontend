import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faDollar,
  faImage,
  faUser,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Caption, Text14, Text16, Title3 } from '@core/atoms/typography';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { glossary } from '@core/lib/glossary';

import { NOT_SUPPORTED_COUNTRIES_LINK } from '../externalLinks';

const ItemRoot = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--unit);
  padding: var(--intermediate-unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--unit);
`;

const ItemContent = styled.div`
  display: flex;
  gap: var(--unit);
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  border-radius: var(--triple-unit);
  background-color: var(--c-neutral-500);
  padding: var(--unit);
  aspect-ratio: 1 / 1;
`;

const StyledChecked = styled(FontAwesomeIcon)`
  margin-left: var(--unit);
`;
type ItemProps = {
  title: ReactNode;
  desc: ReactNode;
  icon: IconProp;
  step: number;
  checked?: boolean;
};
const Item = ({ title, desc, icon, step, checked }: ItemProps) => (
  <ItemRoot>
    <ItemContent>
      <Text16 bold color="var(--c-neutral-1000)">
        {step}
      </Text16>
      <div>
        {title && (
          <Text16 bold color="var(--c-neutral-1000)">
            {title}
            {checked && (
              <StyledChecked icon={faCheckCircle} color="var(--c-green-600)" />
            )}
          </Text16>
        )}
        {desc && <Text14 color="var(--c-neutral-600)">{desc}</Text14>}
      </div>
    </ItemContent>
    <StyledFontAwesomeIcon
      icon={icon}
      size="sm"
      color="var(--c-neutral-1000)"
    />
  </ItemRoot>
);

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  height: 100%;
`;
const LinkInFormattedMessage = styled.a`
  text-decoration: underline;
  color: var(--c-link);
`;

const Actions = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
type Props = {
  statusTarget: FiatWalletAccountState;
  onGetStarted: () => void;
  canDismissAfterActivation?: boolean;
};

export const Intro = ({
  statusTarget,
  canDismissAfterActivation,
  onGetStarted,
}: Props) => {
  const { canListAndTrade } = useFiatBalance();
  const fromListing = statusTarget === FiatWalletAccountState.OWNER;
  const fromOnboarding =
    statusTarget === FiatWalletAccountState.VALIDATED_OWNER &&
    canDismissAfterActivation;
  const fromDepositAndWithdraw =
    statusTarget === FiatWalletAccountState.VALIDATED_OWNER &&
    !canDismissAfterActivation;

  return (
    <Content>
      <Title3>
        {fromListing && (
          <FormattedMessage
            id="createFiatWallet.intro.title"
            defaultMessage="Confirm additional details"
          />
        )}
        {fromOnboarding && (
          <FormattedMessage
            id="createFiatWallet.intro.titleActive.fromOnboarding"
            defaultMessage="It's easy to activate your Cash Wallet"
          />
        )}
        {fromDepositAndWithdraw && (
          <FormattedMessage
            id="createFiatWallet.intro.titleActive"
            defaultMessage="It's easy to activate your Cash Wallet and verify your identity"
          />
        )}
      </Title3>
      {fromListing && (
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="createFiatWallet.intro.description"
            defaultMessage="To list cards and receive cash, you'll need to activate your Cash Wallet by providing some additional information."
          />
        </Text16>
      )}
      <Item
        step={1}
        title={
          <FormattedMessage
            id="createFiatWallet.intro.step1.title"
            defaultMessage="Share some basic info"
          />
        }
        desc={
          <FormattedMessage
            id="createFiatWallet.intro.step1.desc"
            defaultMessage="Share your full name, date of birth, nationality and country of residence."
          />
        }
        icon={faUser}
        checked={canListAndTrade}
      />
      <Item
        step={2}
        title={
          <FormattedMessage
            id="createFiatWallet.intro.step2.title"
            defaultMessage="Choose a currency"
          />
        }
        desc={
          <FormattedMessage
            id="createFiatWallet.intro.step2.desc"
            defaultMessage="Select your preferred currency between USD, EUR, or GBP."
          />
        }
        icon={faDollar}
        checked={canListAndTrade}
      />
      {statusTarget === FiatWalletAccountState.VALIDATED_OWNER && (
        <Item
          step={3}
          title={
            <FormattedMessage
              id="createFiatWallet.intro.step3.title"
              defaultMessage="Add your ID"
            />
          }
          desc={
            <FormattedMessage
              id="createFiatWallet.intro.step3.desc"
              defaultMessage="Upload a government-issued ID to enable cash deposits, cash withdrawals, and cash rewards."
            />
          }
          icon={faImage}
        />
      )}
      <Caption color="var(--c-neutral-600)">
        <FormattedMessage
          id="createFiatWallet.intro.helper"
          defaultMessage="Cash Wallet is powered by Mangopay. Availability may vary depending on your country of residence.{br} <link>Learn more</link>"
          values={{
            link: (text: string) => (
              <LinkInFormattedMessage
                target="_blank"
                rel="noreferrer"
                href={NOT_SUPPORTED_COUNTRIES_LINK}
              >
                {text}
              </LinkInFormattedMessage>
            ),
            br: <br />,
          }}
        />
      </Caption>
      <Actions>
        <Button fullWidth color="blue" medium onClick={onGetStarted}>
          <FormattedMessage
            {...(canListAndTrade ? glossary.continue : glossary.getStarted)}
          />
        </Button>
      </Actions>
    </Content>
  );
};
