import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { useBlockchainContext } from '@sorare/core/src/contexts/blockchain';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { txLink } from '@sorare/core/src/lib/etherscan';
import { glossary } from '@sorare/core/src/lib/glossary';

import FlexToken from '@marketplace/components/token/FlexToken';

import { EthereumCard_token } from './__generated__/index.graphql';

const CARD_DIALOG_WIDTH = 144;

const Container = styled.div`
  max-width: ${CARD_DIALOG_WIDTH}px;
  gap: var(--unit);
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
  width: ${CARD_DIALOG_WIDTH}px;
  display: block;
`;

const DepositButton = styled(LoadingButton)`
  width: 100%;
`;

type Props = {
  token: EthereumCard_token;
};

const EthereumCard = ({ token }: Props) => {
  const { showNotification } = useSnackNotificationContext();
  const [depositing, setDepositing] = useState(false);
  const [deposited, setDeposited] = useState(false);
  const blockchains = useBlockchainContext();

  const deposit = async () => {
    setDepositing(true);
    const result = await blockchains.depositNft(
      token.contractAddress,
      token.assetId
    );
    setDepositing(false);

    if (result?.err) {
      showNotification('errors', { errors: result.err });
    } else {
      const txHash = result?.txHash;
      const link = txHash ? txLink(txHash) : undefined;

      if (result?.type === 'deposit')
        showNotification('ethereumCard', {}, { link });
      if (result?.type === 'approval')
        showNotification('bridgeApproval', {}, { link });

      setDeposited(true);
    }
  };

  return (
    <Container>
      <Card>
        <FlexToken token={token} withLink />
      </Card>
      {!deposited && (
        <DepositButton
          onClick={() => {
            deposit();
          }}
          color="darkGray"
          disabled={deposited || !!token.owner?.optimistic}
          loading={depositing}
          medium
        >
          <FormattedMessage {...glossary.depositAction} />
        </DepositButton>
      )}
    </Container>
  );
};

EthereumCard.fragments = {
  token: gql`
    fragment EthereumCard_token on Token {
      assetId
      slug
      id
      ethereumId
      contractAddress
      owner {
        optimistic
      }
      ...FlexToken_token
    }
    ${FlexToken.fragments.token}
  `,
};

export default EthereumCard;
