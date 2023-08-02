import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControlLabel } from '@material-ui/core';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatCurrency } from '__generated__/globalTypes';
import Checkbox from '@core/atoms/inputs/Checkbox';
import { NativeSelect } from '@core/atoms/inputs/NativeSelect';
import { Caption, Text14, Text16, Title3 } from '@core/atoms/typography';
import { GraphQLResult, GraphqlForm } from '@core/components/form/Form';
import { useIntlContext } from '@core/contexts/intl';
import { fiatWallet } from '@core/lib/glossary';

import StepWrapper from '../StepWrapper';
import {
  LEARN_MORE_ABOUT_FIAT_WALLET,
  MANGOPAY_PRIVACY_POLICY,
  MANGOPAY_TERMS,
} from '../externalLinks';
import { CreateFiatWalletSteps } from '../type';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  justify-content: flex-start;
  height: 100%;
`;

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
  height: 100%;
`;

const CheckboxFormControlLabel = styled(FormControlLabel)`
  margin-left: 0;
  margin-right: 0;
  display: flex;
  align-items: center;
`;

const CurrencyFormControlLabel = styled(FormControlLabel)`
  gap: var(--unit);
  align-items: flex-start;
  margin: 0;
`;

const StyledLink = styled.a`
  font-weight: bold;
  text-decoration: underline;
  color: var(--c-neutral-600);
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--intermediate-unit) var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-300);
`;

const Asterisk = styled.span`
  color: var(--c-red-600);
`;

type Props = {
  presetCurrency?: FiatCurrency;
  presetTerms?: boolean;
  onChange: (
    currency: FiatCurrency,
    mangopayTermsAndConditionsAccepted: boolean
  ) => void;
  onSubmit: () => Promise<GraphQLResult>;
  onSuccess?: () => void;
  setStep: (step: CreateFiatWalletSteps) => void;
};

const currencyMessages = defineMessages({
  [FiatCurrency.EUR]: {
    id: 'createFiatWallet.chooseCurrency.eur',
    defaultMessage: 'Euro (EUR)',
  },
  [FiatCurrency.GBP]: {
    id: 'createFiatWallet.chooseCurrency.gbp',
    defaultMessage: 'Pound sterling (GBP)',
  },
  [FiatCurrency.USD]: {
    id: 'createFiatWallet.chooseCurrency.usd',
    defaultMessage: 'United States dollar (USD)',
  },
});

export const ChooseCurrency = ({
  presetCurrency = undefined,
  presetTerms = false,
  onSubmit: doOnSubmit,
  onChange,
  setStep,
  onSuccess,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const [terms, setTerms] = useState<boolean>(presetTerms);
  const [currency, setCurrency] = useState<FiatCurrency | undefined>(
    presetCurrency
  );

  const currencies = Object.values(FiatCurrency).map(c => ({
    label: formatMessage(currencyMessages[c]),
    value: c,
  }));

  const onSubmit = async (
    values: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const res = await doOnSubmit();
    onResult(res);
  };

  const disabled = !currency || !terms;
  return (
    <StyledGraphqlForm
      onSubmit={(variables, onResult) => {
        onSubmit(variables, onResult);
      }}
      onSuccess={() => {
        if (onSuccess) onSuccess();
        setStep(CreateFiatWalletSteps.ACTIVATION_SUCCESS);
      }}
      render={(Error, SubmitButton) => (
        <StepWrapper
          setStep={setStep}
          step={CreateFiatWalletSteps.CHOOSE_CURRENCY}
          submitButton={
            <SubmitButton color="blue" medium disabled={disabled}>
              <FormattedMessage {...fiatWallet.activateCashWallet} />
            </SubmitButton>
          }
        >
          <Content>
            <>
              <Title3>
                <FormattedMessage
                  id="createFiatWallet.chooseCurrency.title"
                  defaultMessage="Choose your currency"
                />
              </Title3>
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage
                  id="createFiatWallet.chooseCurrency.description"
                  defaultMessage="Choose the currency you prefer for your Cash Wallet. Card prices will also be shown in the currency you select. <link>Learn more</link>"
                  values={{
                    link: (children: string) => (
                      <StyledLink
                        href={LEARN_MORE_ABOUT_FIAT_WALLET}
                        target="_blank"
                      >
                        {children}
                      </StyledLink>
                    ),
                  }}
                />
              </Text16>
              <Block>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  color="var(--c-neutral-600)"
                />
                <Text14 color="var(--c-neutral-700)" bold>
                  <FormattedMessage
                    id="createFiatWallet.currency.info"
                    defaultMessage="Once selected, you cannot change it."
                  />
                </Text14>
              </Block>
              <CurrencyFormControlLabel
                name="currency"
                labelPlacement="top"
                control={
                  <NativeSelect
                    fullWidth
                    placeholder={formatMessage({
                      id: 'createFiatWallet.chooseCurrency.placeholder',
                      defaultMessage: 'Choose your currency',
                    })}
                    name="currency"
                    values={currencies}
                    value={currency ?? ''}
                    onChange={value => {
                      setCurrency(value as FiatCurrency);
                      onChange(value as FiatCurrency, terms);
                    }}
                  />
                }
                label={
                  <Text16 bold color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="createFiatWallet.currency"
                      defaultMessage="Currency"
                    />{' '}
                    <Asterisk>*</Asterisk>
                  </Text16>
                }
              />

              <CheckboxFormControlLabel
                name="terms"
                control={
                  <Checkbox
                    checked={terms}
                    onChange={e => {
                      setTerms(e.target.checked);
                      onChange(currency!, e.target.checked);
                    }}
                  />
                }
                label={
                  <Caption color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="createFiatWallet.chooseCurrency.terms"
                      defaultMessage="I agree to Mangopay’s <linkTerms>Terms and Conditions</linkTerms> and that my personal data will be processed pursuant to the <linkPrivacy>Privacy Policy</linkPrivacy>."
                      values={{
                        linkTerms: (children: string) => (
                          <StyledLink href={MANGOPAY_TERMS} target="_blank">
                            {children}
                          </StyledLink>
                        ),
                        linkPrivacy: (children: string) => (
                          <StyledLink
                            href={MANGOPAY_PRIVACY_POLICY}
                            target="_blank"
                          >
                            {children}
                          </StyledLink>
                        ),
                      }}
                    />
                  </Caption>
                }
              />
              <Error />
            </>
          </Content>
        </StepWrapper>
      )}
    />
  );
};

export default ChooseCurrency;
