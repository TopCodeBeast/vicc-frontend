import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { Bonuses } from './Bonuses';
import { SimpleCollectionPreview } from './SimpleCollectionPreview';
import { CollectionInfo_card } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = { card: CollectionInfo_card; header: ReactNode };

export const CollectionInfo = ({ card, header }: Props) => {
  const { cardCollectionCards, user } = card;
  const { currentUser } = useCurrentUserContext();

  const cardCollectionCard = cardCollectionCards[0] as
    | CollectionInfo_card['cardCollectionCards'][0]
    | undefined;

  if (!cardCollectionCard) {
    return null;
  }

  const { cardCollection } = cardCollectionCard;
  const isOwnCard = currentUser?.slug === user?.slug;
  return (
    <Root>
      {header}

      {isOwnCard && (
        <>
          <Title6>
            <FormattedMessage
              id="CollectionInfo.points"
              defaultMessage="Card points"
            />
          </Title6>
          <Bonuses card={card} />
          <Title6>
            <FormattedMessage
              id="CollectionInfo.album"
              defaultMessage="Collection album"
            />
          </Title6>
        </>
      )}
      <SimpleCollectionPreview
        cardCollection={cardCollection}
        userId={user?.slug}
      />
    </Root>
  );
};

CollectionInfo.fragments = {
  card: gql`
    fragment CollectionInfo_card on Card {
      slug
      assetId
      user {
        slug
      }
      cardCollectionCards {
        id
        cardCollection {
          slug
          ...SimpleCollectionPreview_cardCollection
        }
      }
      ...Bonuses_card
    }
    ${SimpleCollectionPreview.fragments.cardCollection}
    ${Bonuses.fragments.card}
  ` as TypedDocumentNode<CollectionInfo_card>,
};
