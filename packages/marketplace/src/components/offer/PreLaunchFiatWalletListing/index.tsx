import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import {
  Caption,
  Text14,
  Text16,
  Title4,
  Title6,
} from '@sorare/core/src/atoms/typography';
import { TERMS } from '@sorare/core/src/constants/routes';

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

const Recommended = styled.div`
  display: inline-flex;
  border: 1px solid var(--c-neutral-1000);
  padding: 0 var(--half-unit);
  border-radius: var(--half-unit);
`;

const Gap = styled.div`
  height: var(--double-unit);
`;

const LinkToTerms = styled.a`
  text-decoration: underline;
`;

type Props = { setNeedCreateFiatWallet: (b: boolean) => void };

enum OptionValues {
  CASH_AND_ETH = 'CASH_AND_ETH',
  ETH = 'ETH',
}

export const PreLaunchFiatWalletListing = ({
  setNeedCreateFiatWallet,
}: Props) => {
  const options = useMemo(
    () => [
      {
        label: (
          <Option>
            <Recommended>
              <Caption color="var(--c-neutral-1000)">
                <FormattedMessage
                  id="PreLaunchFiatWalletListing.options.recommended"
                  defaultMessage="Recommended"
                />
              </Caption>
            </Recommended>
            <Title6 color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PreLaunchFiatWalletListing.options.cashAndEth.label"
                defaultMessage="Cash or ETH"
              />
            </Title6>
            <Text14 color="var(--c-neutral-600)">
              <FormattedMessage
                id="PreLaunchFiatWalletListing.options.cashAndEth.description"
                defaultMessage="Buyers will have the choice to buy your cards with cash or ETH."
              />
            </Text14>
          </Option>
        ),
        value: OptionValues.CASH_AND_ETH,
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
            <Text14 color="var(--c-neutral-600)">
              <FormattedMessage
                id="PreLaunchFiatWalletListing.options.eth.description"
                defaultMessage="Buyers will only be able to buy your cards with ETH."
              />
            </Text14>
          </Option>
        ),
        value: OptionValues.ETH,
      },
    ],
    []
  );
  const [selectedOption, setSelectedOption] = useState<{
    label: ReactNode;
    value: string;
  } | null>();

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(options[0]);
      setNeedCreateFiatWallet(true);
    }
  }, [options, selectedOption, setNeedCreateFiatWallet]);

  return (
    <Wrapper>
      <Text14 bold color="var(--c-gradient-conversionCredit)">
        <FormattedMessage
          id="preLaunchFiatWalletListing.anouncement"
          defaultMessage="Cash wallet is coming on July 4th!"
        />
      </Text14>
      <Title4>
        <FormattedMessage
          id="preLaunchFiatWalletListing.title"
          defaultMessage="Boost your chances of selling this card and future card listings"
        />
      </Title4>
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage
          id="preLaunchFiatWalletListing.description"
          defaultMessage="Accept cash or ETH from potential buyers starting on July 4th. "
        />
      </Text16>
      <Gap />
      <Text16 bold color="var(--c-neutral-1000)">
        <FormattedMessage
          id="preLaunchFiatWalletListing.inputLabel"
          defaultMessage="How would you like to get paid?"
        />
      </Text16>
      <RadioGroup
        modal
        rounded
        withSpacing
        options={options}
        initiallySelectedValue={OptionValues.CASH_AND_ETH}
        value={selectedOption?.value}
        name="pre-launch-fiat-wallet-listing"
        onChange={(value: string) => {
          setSelectedOption(options.find(o => o.value === value)!);
          setNeedCreateFiatWallet(value === OptionValues.CASH_AND_ETH);
        }}
      />
      <HelperBlock>
        <FontAwesomeIcon icon={faInfoCircle} color="var(--c-neutral-500)" />
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="preLaunchFiatWalletListing.helperBlock"
            defaultMessage="Not sure? Learn more about cash wallet. <link>See details</link>"
            values={{
              link: (s: string) => (
                <LinkToTerms href={TERMS} target="_blank" rel="noreferrer">
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
