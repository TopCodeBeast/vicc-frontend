import { TypedDocumentNode, gql } from '@apollo/client';
import { CSSProperties } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Caption } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_USER_CARD_COLLECTION } from '@sorare/core/src/constants/routes';
import { Link } from '@sorare/core/src/routing/Link';

import { ScarcityLabel } from '@football/components/collections/ScarcityLabel';

import { SimpleCollectionPreview_cardCollection } from './__generated__/index.graphql';

const Root = styled(LinkBox)`
  background: linear-gradient(
      90deg,
      rgba(var(--c-rgb-neutral-300), 0.7),
      transparent 500px
    ),
    top / cover no-repeat var(--background-url);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  display: grid;
  grid-template-columns: calc(5 * var(--unit)) 1fr;
  column-gap: var(--double-unit);
  grid-template-areas:
    'picture rarityAndSeason'
    'picture teamName';
  color: var(--c-neutral-700);
`;
const StyledImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  grid-area: picture;
`;
const RarityAndSeasonWrapper = styled.div`
  grid-area: rarityAndSeason;
  display: flex;
  gap: var(--half-unit);
`;
const TeamName = styled(LinkOverlay)`
  font: var(--t-16);
  grid-area: teamName;
`;

type Props = {
  cardCollection: SimpleCollectionPreview_cardCollection | undefined;
  userId: string | undefined;
};

export const SimpleCollectionPreview = ({ cardCollection, userId }: Props) => {
  if (!cardCollection) {
    return null;
  }

  const { bannerPictureUrl, team, season, rarity } = cardCollection;

  if (!team || !season) return null;

  return (
    <Root
      style={
        { '--background-url': `url(${bannerPictureUrl})` } as CSSProperties
      }
    >
      <StyledImg src={team?.pictureUrl || ''} alt="" />
      <RarityAndSeasonWrapper>
        <Caption bold>
          <ScarcityLabel scarcity={rarity || Rarity.custom_series} />
        </Caption>

        <Caption bold>{season.name}</Caption>
      </RarityAndSeasonWrapper>
      {userId ? (
        <TeamName
          as={Link}
          to={generatePath(FOOTBALL_USER_CARD_COLLECTION, {
            slug: userId,
            collectionSlug: cardCollection.slug,
          })}
        >
          {team.name}
        </TeamName>
      ) : (
        <TeamName as="div">{team.name}</TeamName>
      )}
    </Root>
  );
};

SimpleCollectionPreview.fragments = {
  cardCollection: gql`
    fragment SimpleCollectionPreview_cardCollection on CardCollection {
      id
      slug
      bannerPictureUrl
      rarity
      team {
        ... on TeamInterface {
          slug
          name
          pictureUrl
        }
      }
      season {
        startYear
        name
      }
    }
  ` as TypedDocumentNode<SimpleCollectionPreview_cardCollection>,
};
