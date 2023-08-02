import { TypedDocumentNode, gql } from '@apollo/client';
import { compareDesc, parseISO } from 'date-fns';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Ownership } from '../Ownership';
import { OwnershipHistory_token } from './__generated__/index.graphql';

interface Props {
  token: OwnershipHistory_token;
  title?: ReactNode;
}

const Root = styled.div`
  display: flex;
  gap: var(--unit);
  flex-direction: column;
`;

export const OwnershipHistory = ({ token, title }: Props) => {
  const { ownershipHistory } = token;

  const sortedOwnerHistory = [...ownershipHistory].sort((ownerA, ownerB) =>
    compareDesc(parseISO(ownerA.from), parseISO(ownerB.from))
  );

  if (sortedOwnerHistory.length === 0) return null;

  return (
    <Root>
      {title}
      {sortedOwnerHistory.map(owner => (
        <Ownership owner={owner} key={owner.id} />
      ))}
    </Root>
  );
};

OwnershipHistory.fragments = {
  token: gql`
    fragment OwnershipHistory_token on Token {
      assetId
      slug
      ownershipHistory {
        id
        from
        ...Ownership_tokenOwner
        user {
          slug
        }
      }
    }
    ${Ownership.fragments.tokenOwner}
  ` as TypedDocumentNode<OwnershipHistory_token>,
};
export default OwnershipHistory;
