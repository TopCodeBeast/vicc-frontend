import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatCurrency, SupportedCurrency } from '__generated__/globalTypes';
import CopyToClipboardButton from '@core/atoms/buttons/CopyToClipboardButton';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Caption, Text14, Text16 } from '@core/atoms/typography';
import { HREF_HELP } from '@core/constants/externalLinks';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import useMutation from '@core/hooks/graphql/useMutation';
import { isType } from '@core/lib/gql';

import {
  CreateDepositBankAccount,
  CreateDepositBankAccountVariables,
  CreateWireTransferDeposit,
  CreateWireTransferDepositVariables,
} from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding: var(--double-unit);
  border-radius: var(--unit);
  background-color: var(--c-neutral-300);
`;

const StyledLink = styled.a`
  text-decoration: underline;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const messages = defineMessages({
  title: {
    id: 'WireTransfer.title',
    defaultMessage: 'Important information',
  },
  minimumAmount: {
    id: 'WireTransfer.minimumAmount',
    defaultMessage: 'Minimum amount:',
  },
  transactionFees: {
    id: 'WireTransfer.transactionFees',
    defaultMessage: 'Transaction fees:',
  },
  transactionFeesValue: {
    id: 'WireTransfer.transactionFeesValue',
    defaultMessage:
      'For international wire transfers, please note that your bank may assess additional costs and/or fees. Sorare will charge a {value} fee when your deposit is processed.',
  },
  processingTimes: {
    id: 'WireTransfer.processingTime',
    defaultMessage: 'Processing Time:',
  },
  processingTimesDuration: {
    id: 'WireTransfer.processingTimesDuration',
    defaultMessage: '1-2 business days',
  },
  subtitle: {
    id: 'WireTransfer.subtitle',
    defaultMessage:
      'Use the following details when you initiate a wire transfer:',
  },
  receivingAccountNameLabel: {
    id: 'WireTransfer.receivingAccountNameLabel',
    defaultMessage: 'Receiving Name of Account',
  },
  bicLabel: {
    id: 'WireTransfer.bic',
    defaultMessage: 'Receiving Bank’s BIC',
  },
  ibanLabel: {
    id: 'WireTransfer.iban',
    defaultMessage: 'Receiving Bank’s IBAN',
  },
  referenceLabel: {
    id: 'WireTransfer.referenceLabel',
    defaultMessage: 'Reference',
  },
  referenceWarning: {
    id: 'WireTransfer.referenceWarning',
    defaultMessage: 'Without the reference, the transfer cannot be processed',
  },
  recipientAddressLabel: {
    id: 'WireTransfer.recipientAddressLabel',
    defaultMessage: 'Recipient Address',
  },
  recipientTypeLabel: {
    id: 'WireTransfer.recipientTypeLabel',
    defaultMessage: 'Recipient type',
  },
  receivingBankName: {
    id: 'WireTransfer.receivingBankName',
    defaultMessage: 'Receiving Bank Name',
  },
  business: {
    id: 'WireTransfer.business',
    defaultMessage: 'Business',
  },
});

const CREATE_WIRE_TRANSFER_DEPOSIT_MUTATION = gql`
  mutation CreateWireTransferDeposit($input: createWireTransferDepositInput!) {
    createWireTransferDeposit(input: $input) {
      bankAccount {
        ... on IbanBankAccount {
          id
          ownerName
          iban
          bic
          ownerAddress {
            country
            region
            city
            postalCode
            addressLine1
          }
        }
      }
      wireReference
      errors {
        message
        code
        path
      }
    }
  }
` as TypedDocumentNode<
  CreateWireTransferDeposit,
  CreateWireTransferDepositVariables
>;

const CREATE_DEPOSIT_BANK_ACCOUNT = gql`
  mutation CreateDepositBankAccount(
    $input: createDepositBankAccountMutationInput!
  ) {
    createDepositBankAccount(input: $input) {
      currentUser {
        slug
        accounts {
          id
          accountable {
            ... on FiatWalletAccount {
              id
              state
              firstName
              lastName
              dob
              countryOfResidenceCode
              nationalityCode
              availableBalance
              currency
              totalBalance
            }
          }
        }
      }
      errors {
        message
        code
        path
      }
    }
  }
` as TypedDocumentNode<
  CreateDepositBankAccount,
  CreateDepositBankAccountVariables
>;

const minimumAmount = 20;
const depositFee = 0.003;

const DepositBankAccountInfos = ({
  depositBankAccount,
  wireReference,
}: {
  depositBankAccount: {
    iban: string;
    bic: string;
    ownerAddress?: {
      addressLine1?: string | null;
      addressLine2?: string | null;
      city?: string | null;
      postalCode?: string | null;
    } | null;
  };
  wireReference?: string | null;
}) => {
  const { fiatCurrency, fiatWalletAccountable } = useCurrentUserContext();
  const isEurDeposit = fiatWalletAccountable?.currency === FiatCurrency.EUR;
  const { formatNumber } = useIntlContext();
  return (
    <Wrapper>
      <Text16 bold>
        <FormattedMessage {...messages.title} />
      </Text16>
      {!isEurDeposit && (
        <div>
          <Caption color="var(--c-neutral-600)" bold>
            <FormattedMessage {...messages.minimumAmount} />
          </Caption>
          <Text14>
            {formatNumber(minimumAmount, {
              style: 'currency',
              currency: fiatCurrency.code,
              currencyDisplay: 'narrowSymbol',
            })}
          </Text14>
        </div>
      )}
      <div>
        <Caption color="var(--c-neutral-600)" bold>
          <FormattedMessage {...messages.transactionFees} />
        </Caption>
        <Text14>
          <FormattedMessage
            {...messages.transactionFeesValue}
            values={{ value: `${depositFee * 100}%` }}
          />
        </Text14>
      </div>
      <div>
        <Caption color="var(--c-neutral-600)" bold>
          <FormattedMessage {...messages.processingTimes} />
        </Caption>
        <Text14>
          <FormattedMessage {...messages.processingTimesDuration} />
        </Text14>
      </div>
      <Text16 bold>
        <FormattedMessage {...messages.subtitle} />
      </Text16>
      <Details>
        {!isEurDeposit && (
          <>
            <Row>
              <div>
                <Caption color="var(--c-neutral-600)" bold>
                  <FormattedMessage {...messages.receivingBankName} />
                </Caption>
                <Text14>Barclays Bank</Text14>
              </div>
            </Row>
            <Row>
              <div>
                <Caption color="var(--c-neutral-600)" bold>
                  <FormattedMessage {...messages.receivingAccountNameLabel} />
                </Caption>
                <Text14>Mangopay</Text14>
              </div>
            </Row>
          </>
        )}
        <Row>
          <div>
            <Caption color="var(--c-neutral-600)" bold>
              <FormattedMessage {...messages.bicLabel} />
            </Caption>
            <Text14>{depositBankAccount.bic}</Text14>
          </div>
          <CopyToClipboardButton
            textToCopy={depositBankAccount.bic}
            alignRight
          />
        </Row>
        <Row>
          <div>
            <Caption color="var(--c-neutral-600)" bold>
              <FormattedMessage {...messages.ibanLabel} />
            </Caption>
            <Text14>{depositBankAccount.iban}</Text14>
          </div>
          <CopyToClipboardButton
            textToCopy={depositBankAccount.iban}
            alignRight
          />
        </Row>
        {!isEurDeposit && (
          <>
            {wireReference && (
              <Row>
                <div>
                  <Caption color="var(--c-neutral-600)" bold>
                    <FormattedMessage {...messages.referenceLabel} />
                  </Caption>
                  <Text14>{wireReference}</Text14>
                </div>
                <CopyToClipboardButton textToCopy={wireReference} alignRight />
              </Row>
            )}
            <Row>
              <div>
                <Caption color="var(--c-neutral-600)" bold>
                  <FormattedMessage {...messages.recipientTypeLabel} />
                </Caption>
                <Text14>
                  <FormattedMessage {...messages.business} />
                </Text14>
              </div>
            </Row>
            {depositBankAccount.ownerAddress && (
              <Row>
                <div>
                  <Caption color="var(--c-neutral-600)" bold>
                    <FormattedMessage {...messages.recipientAddressLabel} />
                  </Caption>
                  <Text14>
                    {depositBankAccount.ownerAddress.addressLine1}
                  </Text14>
                  {depositBankAccount.ownerAddress.addressLine2 && (
                    <Text14>
                      {depositBankAccount.ownerAddress.addressLine2}
                    </Text14>
                  )}
                  <Text14>{depositBankAccount.ownerAddress.city}</Text14>
                  <Text14>{depositBankAccount.ownerAddress.postalCode}</Text14>
                </div>
              </Row>
            )}
          </>
        )}
      </Details>
      {!isEurDeposit && (
        <Text16 bold color="var(--c-red-600)">
          <FormattedMessage {...messages.referenceWarning} />
        </Text16>
      )}
      <Text14>
        <FormattedMessage
          id="WireTransfer.help"
          defaultMessage="For more info on Wire Transfers, check out our <link>Help Center</link>"
          values={{
            link: (children: string) => (
              <StyledLink href={HREF_HELP} target="_blank">
                {children}
              </StyledLink>
            ),
          }}
        />
      </Text14>
    </Wrapper>
  );
};

export const GenericWireTransfer = ({ amount }: { amount: number }) => {
  const { fiatCurrency } = useCurrentUserContext();
  const [depositBankAccount, setDepositBankAccount] =
    useState<CreateWireTransferDeposit['createWireTransferDeposit']>();
  const [errors, setErrors] = useState<string[]>([]);
  const [createWireTransfer, { loading: createWireTransferLoading }] =
    useMutation(CREATE_WIRE_TRANSFER_DEPOSIT_MUTATION);

  useEffect(() => {
    async function createWireTransferCallback() {
      const result = await createWireTransfer({
        variables: {
          input: {
            amounts: {
              amount: (amount * 100).toString(),
              currency: fiatCurrency.code as SupportedCurrency,
            },
          },
        },
      });
      if (result.errors.length > 0) {
        setErrors(result.errors.map(error => error.message));
      }
      if (result?.data?.createWireTransferDeposit) {
        setDepositBankAccount(result.data.createWireTransferDeposit);
      }
    }
    if (amount) {
      createWireTransferCallback();
    }
  }, [amount, fiatCurrency, createWireTransfer]);
  if (createWireTransferLoading) return <LoadingIndicator />;
  if (errors && errors.length > 0)
    return <Text14 color="var(--c-red-600)">{errors.join(' - ')}</Text14>;
  if (
    !depositBankAccount ||
    !isType(depositBankAccount.bankAccount, 'IbanBankAccount')
  )
    return null;

  return (
    <DepositBankAccountInfos
      depositBankAccount={depositBankAccount.bankAccount}
      wireReference={depositBankAccount.wireReference}
    />
  );
};

export const WireTransfer = ({ visible }: { visible: boolean }) => {
  const { fiatWalletAccountable, fiatCurrency } = useCurrentUserContext();
  const needToCreateBankDepositAccount = fiatCurrency.code === FiatCurrency.EUR;
  const [createDepositAccountErrors, setCreateDepositAccountErrors] = useState<
    string[]
  >([]);
  const [create, { loading }] = useMutation(CREATE_DEPOSIT_BANK_ACCOUNT);
  const hasDepositBankAccount = fiatWalletAccountable?.depositBankAccount;
  useEffect(() => {
    async function createDepositAccount() {
      const { errors } = await create({ variables: { input: {} } });
      if (errors && errors.length > 0) {
        setCreateDepositAccountErrors(errors.map(error => error.message));
      }
    }
    if (!hasDepositBankAccount && visible && needToCreateBankDepositAccount) {
      createDepositAccount();
    }
  }, [hasDepositBankAccount, visible, needToCreateBankDepositAccount, create]);

  if (loading) return <LoadingIndicator />;
  if (createDepositAccountErrors.length > 0)
    return (
      <Text14 color="var(--c-red-600)">
        {createDepositAccountErrors.join(' - ')}
      </Text14>
    );
  if (!fiatWalletAccountable) return null;
  const { depositBankAccount } = fiatWalletAccountable;
  if (!depositBankAccount || !isType(depositBankAccount, 'IbanBankAccount'))
    return null;
  return <DepositBankAccountInfos depositBankAccount={depositBankAccount} />;
};
