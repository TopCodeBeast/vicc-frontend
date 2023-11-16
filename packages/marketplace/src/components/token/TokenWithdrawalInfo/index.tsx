import { TypedDocumentNode, gql } from '@apollo/client';
import { TextField } from '@material-ui/core';
import Big from 'bignumber.js';
import { ChangeEvent, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import UserBalance from '@sorare/core/src/components/wallet/UserBalance';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import useUnquantizeAmount from '@sorare/core/src/hooks/useUnquantizeAmount';
import { isAddress } from '@sorare/core/src/lib/ethereum';

import { TokenName } from '@marketplace/components/token/TokenName';

import {
  CreateTokenWithdrawalMutation,
  CreateTokenWithdrawalMutationVariables,
  TokenWithdrawalInfo_token,
  TokenWithdrawalInfo_transferRequest,
} from './__generated__/index.graphql';

// BatchMinter.mintCardsForAddressWithSig costs 270,000 gas
// StarkExchange.withdrawAndMint costs 170,000 gas
const MINTING_COST_RATIO = 270000 / (170000 + 270000);

const CREATE_TOKEN_WITHDRAWAL_MUTATION = gql`
  mutation CreateTokenWithdrawalMutation($input: createCardWithdrawalInput!) {
    createCardWithdrawal(input: $input) {
      token {
        slug
        assetId
        pendingWithdrawal {
          id
        }
      }
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  CreateTokenWithdrawalMutation,
  CreateTokenWithdrawalMutationVariables
>;

const messages = defineMessages({
  destinationError: {
    id: 'TokenWithdrawalInfo.destinationError',
    defaultMessage: 'Invalid destination address',
  },
  balanceError: {
    id: 'TokenWithdrawalInfo.balanceError',
    defaultMessage: 'Insufficient balance',
  },
  addressPlaceholder: {
    id: 'TokenWithdrawalInfo.addressPlaceholder',
    defaultMessage: 'Address',
  },
});

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const MainXL = styled.span`
  font: var(--t-bold) var(--t-32);
`;
const ExponentXL = styled(Text16)`
  color: var(--c-neutral-600);
`;

const FeeAmount = ({ feeAmount }: { feeAmount: string }) => {
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      wei: feeAmount,
    },
    primaryCurrency: Currency.ETH,
  });
  return (
    <Column>
      {main && <MainXL>{main}</MainXL>}
      {exponent && <ExponentXL>{exponent}</ExponentXL>}
    </Column>
  );
};
export interface Props {
  token: TokenWithdrawalInfo_token;
  transferRequest: TokenWithdrawalInfo_transferRequest;
  onComplete: () => void;
}

const TotalPrice = styled.div`
  padding-bottom: 30px;
  padding-top: 10px;
  border-bottom: 1px solid var(--c-neutral-300);
  text-align: center;
`;
const Sections = styled.div`
  & > div {
    padding: 10px 0px;
    display: flex;
    justify-content: space-between;
  }
  & > div:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-300);
  }
`;
const Label = styled(Text16)`
  text-decoration: underline;
`;
const Destination = styled.div`
  display: flex;
  flex-direction: column;
`;
const DestinationInput = styled(TextField)`
  margin-top: 10px;
  width: 100%;
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Submit = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;
const Error = styled.div`
  background-color: rgba(var(--c-rgb-red-600), 0.25);
  color: var(--c-red-600);
  padding: 10px;
  border-radius: 8px;
`;
const Disclaimer = styled.div`
  background-color: var(--c-neutral-200);
  border-left: 4px solid var(--c-neutral-600);
  border-radius: 8px;
  padding: 10px;
`;
const CardInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
`;

const TokenWithdrawalInfo = ({ token, transferRequest, onComplete }: Props) => {
  const { ethereumOwner, assetId } = token;
  const { signTransfer } = useWalletContext();
  const { currentUser } = useCurrentUserContext();
  const unquantizeAmount = useUnquantizeAmount();
  const { formatMessage } = useIntlContext();
  const [address, setAddress] = useState<string>('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [create] = useMutation(CREATE_TOKEN_WITHDRAWAL_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
  const feeAmount = unquantizeAmount(
    '0', //transferRequest.feeInfoUser?.feeLimit || '0'
  );

  const canPay =
    new Big(currentUser?.availableBalance || 0).comparedTo(feeAmount) > 0;

  useEffect(() => {
    if (!currentUser) return;

    if (!canPay) setError(formatMessage(messages.balanceError));
  }, [currentUser, canPay, formatMessage]);

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setError(undefined);
    setAddress(event.target.value);
  };

  const submit = async () => {
    setWithdrawing(true);
    if (!isAddress(address)) {
      setError(formatMessage(messages.destinationError));
      setWithdrawing(false);
      return;
    }
    const signature = await signTransfer({
      ...transferRequest,
      receiverPublicKey: address!,
      feeInfoUser: undefined, //transferRequest?.feeInfoUser || undefined,
    });
    await create({
      variables: {
        input: {
          assetId,
          destination: address!,
          /*starkSignatures: [
            {
              nonce: transferRequest!.nonce,
              expirationTimestamp: transferRequest!.expirationTimestamp,
              data: signature!,
            },
          ],*/
        },
      },
    });

    setWithdrawing(false);
    onComplete();
  };
  if (!currentUser) return null;

  return (
    <div>
      <TotalPrice>
        <FeeAmount feeAmount={feeAmount} />
      </TotalPrice>
      <Sections>
        {!ethereumOwner && (
          <>
            <div>
              <Tooltip
                title={
                  <FormattedMessage
                    id="CardWithdrawalInfo.mintingTooltip"
                    defaultMessage="The process of crafting your Vicc Card into a digital asset on Ethereum mainnet."
                  />
                }
              >
                <Label>
                  <FormattedMessage
                    id="CardWithdrawalInfo.minting"
                    defaultMessage="Minting"
                  />
                </Label>
              </Tooltip>
              <AmountWithConversion
                monetaryAmount={{
                  referenceCurrency: SupportedCurrency.WEI,
                  wei: new Big(feeAmount)
                    .multipliedBy(MINTING_COST_RATIO)
                    .toString(),
                }}
                primaryCurrency={Currency.ETH}
                withApproxSymbol
              />
            </div>
            <div>
              <Tooltip
                title={
                  <FormattedMessage
                    id="CardWithdrawalInfo.withdrawalTooltip"
                    defaultMessage="The process of sending your Vicc mainnet NFT to your Ethereum wallet."
                  />
                }
              >
                <Label>
                  <FormattedMessage
                    id="CardWithdrawalInfo.withdrawal"
                    defaultMessage="Withdrawal"
                  />
                </Label>
              </Tooltip>
              <AmountWithConversion
                monetaryAmount={{
                  referenceCurrency: SupportedCurrency.WEI,
                  wei: new Big(feeAmount)
                    .multipliedBy(ethereumOwner ? 1 : 1 - MINTING_COST_RATIO)
                    .toString(),
                }}
                primaryCurrency={Currency.ETH}
                withApproxSymbol
              />
            </div>
          </>
        )}
        <div>
          <Tooltip
            title={
              <FormattedMessage
                id="CardWithdrawalInfo.durationTooltip"
                defaultMessage="The time needed to submit the STARK proof to Ethereum mainnet."
              />
            }
          >
            <Label>
              <FormattedMessage
                id="CardWithdrawalInfo.durationTitle"
                defaultMessage="Estimated duration"
              />
            </Label>
          </Tooltip>
          <Text16>
            <FormattedMessage
              id="CardWithdrawalInfo.durationTime"
              defaultMessage="8-10 hours"
            />
          </Text16>
        </div>
        <Destination>
          <div>
            <Text16>
              <FormattedMessage
                id="CardWithdrawalInfo.destinationLabel"
                defaultMessage="Enter destination wallet address"
              />
            </Text16>
          </div>
          <DestinationInput
            placeholder={formatMessage(messages.addressPlaceholder)}
            type="string"
            variant="outlined"
            onChange={handleChange}
          />
        </Destination>
      </Sections>
      <Bottom>
        <Submit
          color="blue"
          medium
          onClick={() => {
            submit();
          }}
          disabled={!!error || address.length === 0 || withdrawing}
        >
          Withdraw
        </Submit>
        {error && <Error>{error}</Error>}
        <Disclaimer>
          <Text16>
            <FormattedMessage
              id="CardWithdrawalInfo.disclaimer"
              defaultMessage="Your Card will not be available for sale during the transfer"
            />
          </Text16>
        </Disclaimer>
        <div>
          <CardInfoContainer>
            <Text16 as="h6" color="var(--c-neutral-600)">
              <FormattedMessage
                id="CardWithdrawalInfo.cardLable"
                defaultMessage="You withdraw"
              />
            </Text16>
            <TokenName token={token} />
          </CardInfoContainer>
          <Text16 as="h6" color="var(--c-neutral-600)">
            <FormattedMessage
              id="CardWithdrawalInfo.balance"
              defaultMessage="Balance"
            />
          </Text16>
          <UserBalance inline />
        </div>
      </Bottom>
    </div>
  );
};

TokenWithdrawalInfo.fragments = {
  token: gql`
    fragment TokenWithdrawalInfo_token on Token {
      assetId
      slug
      name
      ethereumOwner {
        id
      }
      ...TokenName_token
    }
    ${TokenName.fragments.token}
  ` as TypedDocumentNode<TokenWithdrawalInfo_token>,
  transferRequest: gql`
    fragment TokenWithdrawalInfo_transferRequest on TransferRequest {
      # senderVaultId
      # receiverVaultId
      amount
      token
      nonce
      expirationTimestamp
      #feeInfoUser {
      #  tokenId
      #  sourceVaultId
      #  feeLimit
      #}
    }
  ` as TypedDocumentNode<TokenWithdrawalInfo_transferRequest>,
};

export default TokenWithdrawalInfo;
