import { gql, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16, Title4 } from '@sorare/core/src/atoms/typography';
import ConnectPrivateWallet from '@sorare/core/src/components/wallet/ConnectPrivateWallet';
import useBlockchainAccountData from '@sorare/core/src/hooks/useBlockchainAccountData';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import EmptyState from '../EmptyState';
import EthereumCard from '../EthereumCard';
import {
  EthereumTokensQuery,
  EthereumTokensQueryVariables,
} from './__generated__/index.graphql';

const ETHEREUM_TOKENS_QUERY = gql`
  query EthereumTokensQuery($address: String!) {
    ethereumTokens(address: $address) {
      slug
      assetId
      ...EthereumCard_token
    }
  }
  ${EthereumCard.fragments.token}
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--double-unit);
`;
const Cards = styled.div`
  display: flex;
  gap: var(--double-unit);
  flex-wrap: wrap;
  justify-content: center;
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Wallets = styled.div`
  align-self: center;
  /* min-width: 330px; */
  width: 100%;
`;

type Props = {
  closeDialog: () => void;
};

const DialogContainer = ({ closeDialog }: Props) => {
  const accountData = useBlockchainAccountData();

  const [loadCards, { loading, data }] = useLazyQuery<
    EthereumTokensQuery,
    EthereumTokensQueryVariables
  >(ETHEREUM_TOKENS_QUERY);

  useEffect(() => {
    if (!accountData?.ethAccount) return;

    loadCards({
      variables: { address: accountData.ethAccount },
    });
  }, [accountData, loadCards]);

  if (!accountData) {
    return (
      <Container>
        <Title4>
          <FormattedMessage
            id="DepositCard.Container.disconnectedTitle"
            defaultMessage="No Ethereum wallet connected"
          />
        </Title4>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="DepositCard.Container.disconnectedDesc"
            defaultMessage="Connect your Ethereum wallet to deposit Cards into your Sorare account"
          />
        </Text16>
        <Wallets>
          <ConnectPrivateWallet />
        </Wallets>
      </Container>
    );
  }

  if (!data || loading) return <LoadingIndicator />;

  const { ethereumTokens } = data;

  return (
    <Container>
      {ethereumTokens!.length === 0 ? (
        <EmptyState
          closeDialog={closeDialog}
          accountAddress={accountData?.ethAccount}
        />
      ) : (
        <Cards>
          {ethereumTokens!.map(card => (
            <EthereumCard key={card.slug} token={card} />
          ))}
        </Cards>
      )}
    </Container>
  );
};

export default DialogContainer;
