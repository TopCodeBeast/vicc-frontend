import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import {
  Caption,
  Text14,
  Text16,
  Title4,
  Title6,
} from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { AcceptedCurrenciesValue } from '@sorare/core/src/hooks/useAcceptedCurrencies';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

const LEARN_MORE_LINK =
  'https://help.vicc.com/hc/en-us/articles/4402888626577-What-is-a-wallet-and-why-do-I-need-one-';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding: var(--double-and-a-half-unit) var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-200);
  .dark-theme & {
    background-color: var(--c-neutral-300);
  }
`;

const HelperBlock = styled.div`
  background-color: var(--c-neutral-400);
  padding: var(--unit);
  border-radius: var(--unit);
  display: flex;
  align-items: center;
  gap: var(--double-unit);
`;
const Option = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--half-unit);
`;

const RecommendedBorder = styled.div`
  display: inline-flex;
  background: var(--c-gradient-conversionCreditBorder);
  border-radius: var(--half-unit);
  padding: 1px;
`;

const Recommended = styled.div`
  display: flex;
  background-color: var(--c-neutral-300);
  padding: 0 var(--half-unit);
  border-radius: var(--half-unit);
`;

const Gap = styled.div`
  height: var(--double-unit);
`;

const LinkToTerms = styled.a`
  text-decoration: underline;
`;

const StyledCaption = styled(Caption)`
  background: -webkit-linear-gradient(85deg, #7724ff 0%, #f3d0dd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledTitle4 = styled(Title4)`
  background: -webkit-linear-gradient(85deg, #7724ff 0%, #f3d0dd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const messages = defineMessages({
  prelaunchAnouncement: {
    id: 'preLaunchFiatWalletListing.anouncement',
    defaultMessage: 'Cash Wallet is coming on Wednesday!',
  },
  announcement: {
    id: 'postLaunchFiatWalletListing.anouncement',
    defaultMessage: 'Cash Wallet has landed!',
  },
  prelaunchDesc: {
    id: 'preLaunchFiatWalletListing.description',
    defaultMessage:
      'Increase your chances of selling your current and upcoming card listings by accepting cash and ETH from potential buyers <b>starting on Wednesday</b>.',
  },
  desc: {
    id: 'postLaunchFiatWalletListing.description',
    defaultMessage:
      'Increase your chances of selling your current and upcoming card listings by accepting cash and ETH from potential buyers.',
  },
  prelaunchCashAndEthDesc: {
    id: 'PreLaunchFiatWalletListing.options.cashAndEth.description.prelaunch',
    defaultMessage:
      'Starting on Wednesday, Vicc Managers can pay you with either cash or ETH.',
  },
  cashAndEthDesc: {
    id: 'postLaunchFiatWalletListing.options.cashAndEth.description',
    defaultMessage: 'Vicc Managers can pay you with either cash or ETH.',
  },
});

type Props = { onChange: (a: AcceptedCurrenciesValue) => void };

export const AcceptedCurrenciesOnListing = ({ onChange }: Props) => {
  const {
    flags: { useEnableFiatWalletBeforeLaunch, useCashWallet },
  } = useFeatureFlags();

  const options = useMemo(
    () => [
      {
        label: (
          <Option>
            <RecommendedBorder>
              <Recommended>
                <StyledCaption bold color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="PreLaunchFiatWalletListing.options.recommended"
                    defaultMessage="Recommended"
                  />
                </StyledCaption>
              </Recommended>
            </RecommendedBorder>
            <Title6 color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PreLaunchFiatWalletListing.options.cashAndEth.label"
                defaultMessage="Cash or ETH"
              />
            </Title6>
            <Text14 color="var(--c-neutral-800)">
              <FormattedMessage
                {...(useEnableFiatWalletBeforeLaunch && !useCashWallet
                  ? messages.prelaunchCashAndEthDesc
                  : messages.cashAndEthDesc)}
              />
            </Text14>
            {useEnableFiatWalletBeforeLaunch && !useCashWallet && (
              <Caption color="var(--c-neutral-600)">
                <FormattedMessage
                  id="PreLaunchFiatWalletListing.options.cashAndEth.caption"
                  defaultMessage="Please note that until Wednesday, Managers can only pay you in ETH."
                />
              </Caption>
            )}
          </Option>
        ),
        value: AcceptedCurrenciesValue.BOTH,
      },
      {
        label: (
          <Option>
            <Title6 color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PreLaunchFiatWalletListing.options.eth.label"
                defaultMessage="ETH only"
              />
            </Title6>
            <Text14 color="var(--c-neutral-800)">
              <FormattedMessage
                id="PreLaunchFiatWalletListing.options.eth.description"
                defaultMessage="Buyers will only be able to buy your cards with ETH."
              />
            </Text14>
          </Option>
        ),
        value: AcceptedCurrenciesValue.ETH,
      },
    ],
    [useEnableFiatWalletBeforeLaunch, useCashWallet]
  );
  const [selectedOption, setSelectedOption] = useState<{
    label: ReactNode;
    value: AcceptedCurrenciesValue;
  } | null>(null);

  return (
    <Wrapper>
      <>
        <StyledTitle4>
          <FormattedMessage
            {...(useEnableFiatWalletBeforeLaunch && !useCashWallet
              ? messages.prelaunchAnouncement
              : messages.announcement)}
          />
        </StyledTitle4>
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            {...(useEnableFiatWalletBeforeLaunch && !useCashWallet
              ? messages.prelaunchDesc
              : messages.desc)}
            values={{
              b: Bold,
            }}
          />
        </Text16>
        <Gap />
      </>

      <Text16 bold color="var(--c-neutral-1000)">
        <FormattedMessage
          id="preLaunchFiatWalletListing.inputLabel"
          defaultMessage="How would you like to get paid?"
        />
      </Text16>
      <RadioGroup<AcceptedCurrenciesValue>
        modal
        rounded
        withSpacing
        options={options}
        value={selectedOption?.value}
        preventPreselection
        name="pre-launch-fiat-wallet-listing"
        onChange={value => {
          setSelectedOption(options.find(o => o.value === value)!);
          onChange(value);
        }}
      />
      <HelperBlock>
        <FontAwesomeIcon icon={faInfoCircle} color="var(--c-neutral-1000)" />
        <Text14 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="preLaunchFiatWalletListing.helperBlock"
            defaultMessage="Not sure? Learn more about Cash Wallet. <link>See details</link>"
            values={{
              link: (s: string) => (
                <LinkToTerms
                  href={LEARN_MORE_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s}
                </LinkToTerms>
              ),
            }}
          />
        </Text14>
      </HelperBlock>
    </Wrapper>
  );
};
