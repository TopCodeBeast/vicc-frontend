import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';
import { FormControlLabel } from '@material-ui/core';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { BankAccountType } from '__generated__/globalTypes';
import { NativeSelect } from '@core/atoms/inputs/NativeSelect';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16, Text18 } from '@core/atoms/typography';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useMutation from '@core/hooks/graphql/useMutation';
import { useIntlCountries } from '@core/hooks/useIntlCountries';
import { glossary } from '@core/lib/glossary';

import {
  BankAccountCountryInfosQuery,
  BankAccountCountryInfosQueryVariables,
  createWithdrawalBankAccountMutation,
  createWithdrawalBankAccountMutationVariables,
} from './__generated__/index.graphql';
import { messages } from './messages';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  gap: var(--unit);
  align-items: flex-start;
  margin: 0;
  font-size: var(--t-16);
`;

const StyledTextField = styled(TextField)`
  border-radius: var(--quadruple-unit);
`;

const Asterisk = styled.span`
  color: var(--c-red-600);
`;

const BANK_ACCOUNT_COUNTRY_INFOS_QUERY = gql`
  query BankAccountCountryInfosQuery($countryCode: String!) {
    mangopay {
      id
      bankAccountType(countryCode: $countryCode)
      ownerRegionRequired(countryCode: $countryCode)
    }
  }
` as TypedDocumentNode<
  BankAccountCountryInfosQuery,
  BankAccountCountryInfosQueryVariables
>;

const CREATE_WITHDRAWAL_BANK_ACCOUNT_MUTATION = gql`
  mutation createWithdrawalBankAccountMutation(
    $input: createWithdrawalBankAccountInput!
  ) {
    createWithdrawalBankAccount(input: $input) {
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  createWithdrawalBankAccountMutation,
  createWithdrawalBankAccountMutationVariables
>;

export const AddBankAccount = () => {
  const { setCurrentTab } = useWalletDrawerContext();
  const { fiatWalletAccountable } = useCurrentUserContext();
  const { formatMessage } = useIntlContext();
  const countries = useIntlCountries();

  const [create] = useMutation(CREATE_WITHDRAWAL_BANK_ACCOUNT_MUTATION, {
    refetchQueries: ['WithdrawalBankAccountsQuery'],
  });

  const [query, { data, loading }] = useLazyQuery(
    BANK_ACCOUNT_COUNTRY_INFOS_QUERY
  );

  const fiatWalletCurrency = fiatWalletAccountable?.currency;

  const bankAccountType = data?.mangopay.bankAccountType;
  const regionNeeded = data?.mangopay.ownerRegionRequired;

  const [bankCountry, setBankCountry] = useState<
    { value: string; label: string } | undefined
  >();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bankIdentifier, setBankIdentifier] = useState('');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [addressCountry, setAddressCountry] = useState<
    { value: string; label: string } | undefined
  >();
  const [branchCode, setBranchCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressRegion, setAddressRegion] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [addressCity, setAddressCity] = useState('');

  const formIsIncomplete = useMemo(
    () =>
      [
        bankCountry,
        firstName,
        lastName,
        bankIdentifier,
        accountIdentifier,
        (bankAccountType === BankAccountType.CA && branchCode && bankName) ||
          bankAccountType !== BankAccountType.CA,
        addressCountry,
        addressLine1,
        (regionNeeded && addressRegion) || !regionNeeded,
        addressPostalCode,
        addressCity,
      ].some(field => !field),
    [
      accountIdentifier,
      addressCity,
      addressCountry,
      addressLine1,
      addressPostalCode,
      addressRegion,
      bankAccountType,
      bankCountry,
      bankName,
      branchCode,
      firstName,
      lastName,
      regionNeeded,
      bankIdentifier,
    ]
  );

  const saveBankAccount = useCallback(
    async (onResult: (result: GraphQLResult) => void) => {
      if (formIsIncomplete || !bankAccountType) return;

      const { errors } = await create({
        variables: {
          input: {
            ownerName: `${firstName.trim()} ${lastName.trim()}`,
            ownerAddress: {
              addressLine1,
              city: addressCity,
              country: addressCountry!.value,
              postalCode: addressPostalCode,
              ...(regionNeeded ? { region: addressRegion } : {}),
            },
            countryCode: bankCountry!.value,
            accountIdentifier,
            bankIdentifier,
            bankAccountType,
            ...(bankAccountType === BankAccountType.CA
              ? {
                  branchCode,
                  bankName,
                }
              : {}),
          },
        },
      });

      onResult({ errors });
    },
    [
      accountIdentifier,
      addressCity,
      addressCountry,
      addressLine1,
      addressPostalCode,
      addressRegion,
      bankAccountType,
      bankCountry,
      bankIdentifier,
      bankName,
      branchCode,
      create,
      firstName,
      formIsIncomplete,
      lastName,
      regionNeeded,
    ]
  );

  if (!fiatWalletCurrency) return null;

  const swiftMessage = {
    [BankAccountType.IBAN]: messages.swiftBic,
    [BankAccountType.CA]: messages.institutionNumber,
    [BankAccountType.OTHER]: messages.swiftBic,
    [BankAccountType.US]: messages.routingNumber,
    [BankAccountType.GB]: messages.sortCode,
  }[bankAccountType || BankAccountType.OTHER];

  const accountNumberMessage = {
    [BankAccountType.IBAN]: messages.iban,
    [BankAccountType.CA]: messages.accountNumber,
    [BankAccountType.OTHER]: messages.accountNumber,
    [BankAccountType.US]: messages.accountNumber,
    [BankAccountType.GB]: messages.accountNumber,
  }[bankAccountType || BankAccountType.OTHER];

  return (
    <GraphqlForm
      onSuccess={() => {
        setCurrentTab(WalletTab.WITHDRAW_TO_FIAT_WALLET);
      }}
      onSubmit={(values, onResult) => {
        saveBankAccount(onResult);
      }}
      render={(Error, SubmitButton) => (
        <Root>
          <Section>
            <Text18 bold>
              <FormattedMessage
                id="Withdraw.WithdrawFiat.AddBankAccount.addBankAccountInfo"
                defaultMessage="Add bank account info"
              />
            </Text18>
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage
                id="Withdraw.WithdrawFiat.AddBankAccount.itWillTake1To2BusinessDays"
                defaultMessage="It will take 1-2 business days to complete your withdrawal."
              />
            </Text16>
            <Section>
              <StyledFormControlLabel
                control={
                  <NativeSelect
                    values={countries}
                    value={bankCountry?.value || ''}
                    name="currency"
                    fullWidth
                    placeholder={formatMessage(messages.bankCountryPlaceholder)}
                    onChange={(value: string) => {
                      const country = countries?.find(n => n.value === value);

                      if (country) {
                        setBankCountry(country);
                        query({
                          variables: {
                            countryCode: country.value,
                          },
                        });
                      }
                    }}
                  />
                }
                label={
                  <Text16 bold color="var(--c-neutral-1000)">
                    <FormattedMessage {...messages.bankCountry} />{' '}
                    <Asterisk>*</Asterisk>
                  </Text16>
                }
                labelPlacement="top"
              />
            </Section>
          </Section>
          {loading ? (
            <LoadingIndicator small />
          ) : (
            <>
              {bankAccountType && (
                <>
                  <Section>
                    <Field>
                      <Text16 bold color="var(--c-neutral-1000)">
                        <FormattedMessage {...messages.accountHolderName} />{' '}
                        <Asterisk>*</Asterisk>
                      </Text16>
                      <StyledTextField
                        name="firstName"
                        placeholder={formatMessage(glossary.firstName)}
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                        withoutAsterisk
                      />
                      <StyledTextField
                        name="lastName"
                        placeholder={formatMessage(glossary.lastName)}
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                        withoutAsterisk
                      />
                    </Field>
                    <StyledFormControlLabel
                      control={
                        <StyledTextField
                          name="accountNumber"
                          placeholder={formatMessage(accountNumberMessage)}
                          value={accountIdentifier}
                          onChange={e => setAccountIdentifier(e.target.value)}
                          required
                          withoutAsterisk
                        />
                      }
                      label={
                        <Text16 bold color="var(--c-neutral-1000)">
                          <FormattedMessage {...accountNumberMessage} />{' '}
                          <Asterisk>*</Asterisk>
                        </Text16>
                      }
                      labelPlacement="top"
                    />
                    <StyledFormControlLabel
                      control={
                        <StyledTextField
                          name="swiftBic"
                          placeholder={formatMessage(swiftMessage)}
                          value={bankIdentifier}
                          onChange={e => setBankIdentifier(e.target.value)}
                          required
                          withoutAsterisk
                        />
                      }
                      label={
                        <Text16 bold color="var(--c-neutral-1000)">
                          <FormattedMessage {...swiftMessage} />{' '}
                          <Asterisk>*</Asterisk>
                        </Text16>
                      }
                      labelPlacement="top"
                    />
                    {bankAccountType === BankAccountType.CA && (
                      <>
                        <StyledFormControlLabel
                          control={
                            <StyledTextField
                              name="bankName"
                              placeholder={formatMessage(messages.bankName)}
                              value={bankName}
                              onChange={e => setBankName(e.target.value)}
                              required
                              withoutAsterisk
                            />
                          }
                          label={
                            <Text16 bold color="var(--c-neutral-1000)">
                              <FormattedMessage {...messages.bankName} />{' '}
                              <Asterisk>*</Asterisk>
                            </Text16>
                          }
                          labelPlacement="top"
                        />
                        <StyledFormControlLabel
                          control={
                            <StyledTextField
                              name="branchCode"
                              placeholder={formatMessage(messages.branchCode)}
                              value={branchCode}
                              onChange={e => setBranchCode(e.target.value)}
                              size={3}
                              required
                              withoutAsterisk
                            />
                          }
                          label={
                            <Text16 bold color="var(--c-neutral-1000)">
                              <FormattedMessage {...messages.branchCode} />{' '}
                              <Asterisk>*</Asterisk>
                            </Text16>
                          }
                          labelPlacement="top"
                        />
                      </>
                    )}
                  </Section>
                  <Section>
                    <Text18 bold>
                      <FormattedMessage
                        id="Withdraw.WithdrawFiat.AddBankAccount.addAddressAssociated"
                        defaultMessage="Add address associated with this account"
                      />
                    </Text18>
                    <Text16 color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="Withdraw.WithdrawFiat.AddBankAccount.addAddressDescription"
                        defaultMessage="This is the address the bank or financial institution has on file for this account."
                      />
                    </Text16>
                    <Field>
                      <NativeSelect
                        values={countries}
                        value={addressCountry?.value || ''}
                        name="currency"
                        fullWidth
                        placeholder={formatMessage(
                          messages.addressCountryPlaceholder
                        )}
                        onChange={(value: string) => {
                          setAddressCountry(
                            countries?.find(n => n.value === value)
                          );
                        }}
                      />
                      <StyledTextField
                        name="addressLine1"
                        placeholder={formatMessage(messages.addressLine1)}
                        value={addressLine1}
                        onChange={e => setAddressLine1(e.target.value)}
                        required
                        withoutAsterisk
                      />
                      {regionNeeded && (
                        <StyledTextField
                          name="addressRegion"
                          placeholder={formatMessage(messages.addressRegion)}
                          value={addressRegion}
                          onChange={e => setAddressRegion(e.target.value)}
                          required
                          withoutAsterisk
                        />
                      )}
                      <StyledTextField
                        name="addressPostalCode"
                        placeholder={formatMessage(messages.postalCode)}
                        value={addressPostalCode}
                        onChange={e => setAddressPostalCode(e.target.value)}
                        required
                        withoutAsterisk
                      />
                      <StyledTextField
                        name="addressCity"
                        placeholder={formatMessage(messages.city)}
                        value={addressCity}
                        onChange={e => setAddressCity(e.target.value)}
                        required
                        withoutAsterisk
                      />
                    </Field>
                  </Section>
                  <Error />
                  <SubmitButton
                    disabled={formIsIncomplete}
                    color="blue"
                    medium
                    fullWidth
                  >
                    <FormattedMessage
                      id="Withdraw.WithdrawFiat.AddBankAccount.saveBankAccount"
                      defaultMessage="Save bank account"
                    />
                  </SubmitButton>
                </>
              )}
            </>
          )}
        </Root>
      )}
    />
  );
};
