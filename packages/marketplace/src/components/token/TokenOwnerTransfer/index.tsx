import { gql } from '@apollo/client';
import styled from 'styled-components';

import { TokenOwnerPrice } from '../TokenOwnerPrice';
import TokenTransferTypeIcon from '../TokenTransferTypeIcon';
import { TokenOwnerTransfer_owner } from './__generated__/index.graphql';

interface Props {
  tokenOwner: TokenOwnerTransfer_owner | null;
}

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-1000);
`;

export const TokenOwnerTransfer = ({ tokenOwner }: Props) => {
  if (!tokenOwner) return null;

  return (
    <Root>
      <TokenTransferTypeIcon transferType={tokenOwner.transferType} />
      <TokenOwnerPrice tokenOwner={tokenOwner} />
    </Root>
  );
};

TokenOwnerTransfer.fragments = {
  tokenOwner: gql`
    fragment TokenOwnerTransfer_owner on TokenOwner {
      id
      transferType
      ...TokenOwnerPrice_tokenOwner
    }
    ${TokenOwnerPrice.fragments.tokenOwner}
  `,
};

export default TokenOwnerTransfer;
