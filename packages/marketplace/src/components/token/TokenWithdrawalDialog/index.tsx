import { TypedDocumentNode, gql } from '@apollo/client';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title6 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import TokenWithdrawalInfo from '../TokenWithdrawalInfo';
import {
  GetTransferRequestMutation,
  GetTransferRequestMutationVariables,
  TokenWithdrawalDialog_token,
} from './__generated__/index.graphql';

type GetTransferRequestMutation_prepareCardWithdrawal_transferRequest =
  NonNullable<
    GetTransferRequestMutation['prepareCardWithdrawal']
  >['transferRequest'];

const GET_TRANSFER_REQUEST_MUTATION = gql`
  mutation GetTransferRequestMutation($input: prepareCardWithdrawalInput!) {
    prepareCardWithdrawal(input: $input) {
      transferRequest {
        ...TokenWithdrawalInfo_transferRequest
      }
      errors {
        message
        code
      }
    }
  }
  ${TokenWithdrawalInfo.fragments.transferRequest}
` as TypedDocumentNode<
  GetTransferRequestMutation,
  GetTransferRequestMutationVariables
>;

const messages = defineMessages({
  withdraw: {
    id: 'BlockchainInfo.withdraw',
    defaultMessage: 'Withdraw to Ethereum',
  },
  mintAndWithdraw: {
    id: 'BlockchainInfo.mintAndWithdraw',
    defaultMessage: 'Mint and withdraw to Ethereum',
  },
});

export interface Props {
  token: TokenWithdrawalDialog_token;
}

const CenteredTitle6 = styled(Title6)`
  text-align: center;
`;
const Body = styled.div`
  padding: var(--triple-unit);
`;
const Loading = styled.div`
  height: 460px;
`;
const ButtonIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;

const TokenWithdrawalDialog = ({ token }: Props) => {
  const { assetId, ethereumOwner } = token;
  const { formatMessage } = useIntlContext();
  const [prepare] = useMutation(GET_TRANSFER_REQUEST_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
  const [open, setOpen] = useState(false);
  const [transferRequest, setTransferRequest] = useState<
    | GetTransferRequestMutation_prepareCardWithdrawal_transferRequest
    | null
    | undefined
  >(undefined);

  useEffect(() => {
    const getTransferRequest = async () => {
      const { data } = await prepare({
        variables: { input: { assetId } },
      });

      setTransferRequest(data?.prepareCardWithdrawal?.transferRequest || null);
    };

    if (open && transferRequest === undefined) getTransferRequest();
  }, [assetId, prepare, transferRequest, open]);

  const title = formatMessage(
    ethereumOwner ? messages.withdraw : messages.mintAndWithdraw
  );

  const renderContent = () => {
    if (transferRequest === undefined)
      return (
        <Loading>
          <LoadingIndicator />
        </Loading>
      );
    if (transferRequest === null) return 'Unable to withdraw Card';

    return (
      <TokenWithdrawalInfo
        token={token}
        transferRequest={transferRequest}
        onComplete={() => setOpen(false)}
      />
    );
  };

  return (
    <div>
      <Button compact color="blue" onClick={() => setOpen(true)}>
        <ButtonIcon icon={faEthereum} />
        {title}
      </Button>
      <Dialog
        open={open}
        maxWidth="sm"
        onClose={() => setOpen(false)}
        title={<CenteredTitle6>{title}</CenteredTitle6>}
        body={<Body>{renderContent()}</Body>}
      />
    </div>
  );
};

TokenWithdrawalDialog.fragments = {
  token: gql`
    fragment TokenWithdrawalDialog_token on Token {
      assetId
      slug
      ethereumOwner {
        id
      }
      ...TokenWithdrawalInfo_token
    }
    ${TokenWithdrawalInfo.fragments.token}
  ` as TypedDocumentNode<TokenWithdrawalDialog_token>,
};

export default TokenWithdrawalDialog;
