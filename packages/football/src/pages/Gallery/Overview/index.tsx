import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import CardsOnSale from '@football/pages/Gallery/CardsOnSale';
import DecksPreview from '@football/pages/Gallery/DecksPreview';
import HighlightedCards from '@football/pages/Gallery/HighlightedCards';

import { Overview_publicUserInfoInterface } from './__generated__/index.graphql';

interface Props {
  user: Overview_publicUserInfoInterface;
  readOnly: boolean;
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  color: var(--c-neutral-1000);
`;

export const Overview = ({ user, readOnly }: Props) => {
  return (
    <Content>
      <HighlightedCards user={user} readOnly={readOnly} />
      <DecksPreview userSlug={user.slug} readOnly={readOnly} />
      <CardsOnSale user={user} />
    </Content>
  );
};

Overview.fragments = {
  user: gql`
    fragment Overview_publicUserInfoInterface on PublicUserInfoInterface {
      id
      slug
      ...HighlightedCards_user
    }
    ${HighlightedCards.fragments.user}
  ` as TypedDocumentNode<Overview_publicUserInfoInterface>,
};

export default Overview;
