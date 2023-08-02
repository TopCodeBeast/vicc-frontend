import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { Score } from '@sorare/core/src/components/collections/Score';
import { FOOTBALL_USER_CARD_COLLECTION_CARDS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { ScarcityLabel } from '@football/components/collections/ScarcityLabel';

import { CollectionRequirements_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;

const RequirementsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const RequirementWrapper = styled.div`
  width: 100%;
  display: grid;
  align-items: center;
  column-gap: var(--unit);
  grid-template-areas:
    'rarity season score'
    'collection_name collection_name score';
  grid-template-columns: max-content 1fr min-content;
`;
const RarityWrapper = styled.div`
  grid-area: rarity;
`;
const SeasonWrapper = styled.div`
  grid-area: season;
`;
const ScoreWrapper = styled.div`
  grid-area: score;
`;
const NameWrapper = styled.div`
  grid-area: collection_name;
`;

type Props = {
  item: CollectionRequirements_shopItem;
};
export const CollectionRequirements = ({ item }: Props) => {
  const { currentUser } = useCurrentUserContext();
  return (
    <Root>
      <Text16>
        <FormattedMessage
          id="ItemPreviewDialog.Requirements.title"
          defaultMessage="To gain access to this item, you must complete <b>one of the following Collection requirements</b>"
          values={{ b: Bold }}
        />
      </Text16>
      <RequirementsWrapper>
        {item.cardCollectionRequirements.map(({ score, cardCollection }) => (
          <RequirementWrapper key={cardCollection.slug}>
            <RarityWrapper>
              {cardCollection.rarity && (
                <ScarcityLabel scarcity={cardCollection.rarity} />
              )}
            </RarityWrapper>
            <SeasonWrapper>{cardCollection.season?.name}</SeasonWrapper>
            <NameWrapper>
              <Text14 bold>
                <Link
                  to={generatePath(FOOTBALL_USER_CARD_COLLECTION_CARDS, {
                    slug: currentUser?.slug,
                    collectionSlug: cardCollection.slug,
                  })}
                >
                  {cardCollection.name}
                </Link>
              </Text14>
            </NameWrapper>
            <ScoreWrapper>
              <Score score={score} />
            </ScoreWrapper>
          </RequirementWrapper>
        ))}
      </RequirementsWrapper>
    </Root>
  );
};

CollectionRequirements.fragments = {
  shopItem: gql`
    fragment CollectionRequirements_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        cardCollectionRequirements {
          score
          cardCollection {
            slug
            name
            season {
              startYear
              name
            }
            rarity
          }
        }
      }
    }
  ` as TypedDocumentNode<CollectionRequirements_shopItem>,
};
