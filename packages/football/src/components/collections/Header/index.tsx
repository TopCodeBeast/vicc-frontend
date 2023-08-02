import { TypedDocumentNode, gql } from '@apollo/client';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { CSSProperties } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Container from '@sorare/core/src/atoms/layout/Container';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import { CollectionHeaderStats } from '@sorare/core/src/components/collections/CollectionHeaderStats';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import User from '@sorare/core/src/components/user/User';
import {
  FOOTBALL_USER_CARD_COLLECTION_CARDS,
  FOOTBALL_USER_GALLERY_CARD_COLLECTIONS,
} from '@sorare/core/src/constants/routes';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { getCollectionsTeamShield } from '@sorare/core/src/lib/collections';
import { socialShareEventContext } from '@sorare/core/src/lib/events';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { ScarcityLabel } from '@football/components/collections/ScarcityLabel';

import {
  Header_cardCollection,
  Header_userCardCollection,
} from './__generated__/index.graphql';

const Root = styled.div`
  background: linear-gradient(
      180deg,
      rgba(var(--c-static-rgb-neutral-1000), 0),
      var(--c-static-neutral-1000)
    ),
    top / cover no-repeat var(--background-url);
  overflow: hidden;
`;
const StyledContainer = styled(Container)`
  color: var(--c-static-neutral-100);
  padding-top: var(--unit);
  padding-bottom: var(--double-unit);
  @media ${tabletAndAbove} {
    padding-top: var(--intermediate-unit);
    padding-bottom: var(--quadruple-unit);
  }
`;
const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Ctas = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TeamInfos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-areas:
      'img rarityAndSeason'
      'img title'
      'img username';
    column-gap: var(--quadruple-unit);
  }
`;
const RarityAndSeason = styled.div`
  display: flex;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    grid-area: rarityAndSeason;
    align-self: flex-end;
  }
`;
const StyledImg = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: var(--intermediate-unit);
  @media ${tabletAndAbove} {
    margin-bottom: 0;
    grid-area: img;
  }
`;
const StyledTitle2 = styled(Title2)`
  grid-area: title;
  @media ${tabletAndAbove} {
    align-self: flex-start;
  }
`;
const UsernameWrapper = styled.div`
  grid-area: username;
  justify-self: start;
  align-self: center;
  @media ${laptopAndAbove} {
    align-self: flex-start;
  }
`;
const IconWrapper = styled.span`
  & > * {
    height: var(--intermediate-unit);
  }
`;

type Props = {
  cardCollection: Header_cardCollection;
  userCardCollection?: Header_userCardCollection | null;
  userSlug?: string;
};
export const Header = ({
  cardCollection,
  userCardCollection,
  userSlug,
}: Props) => {
  const {
    bannerPictureUrl,
    rarity,
    team,
    season,
    slotsCount,
    bonusThresholds,
  } = cardCollection;
  const onBack = useSafePreviousNavigate(
    generatePath(FOOTBALL_USER_GALLERY_CARD_COLLECTIONS, {
      slug: userSlug,
    })
  );

  if (!team) {
    return null;
  }

  const { pictureUrl, name } = team;
  const { user, fulfilledSlotsCount, score, bonus, liveRanking } =
    userCardCollection || {};

  return (
    <Root
      style={
        { '--background-url': `url(${bannerPictureUrl})` } as CSSProperties
      }
    >
      <StyledContainer>
        <InnerWrapper>
          <Ctas>
            <IconButton
              color="white"
              small
              onClick={onBack}
              icon={faChevronLeft}
            />
            <SocialShare
              url={`${window.location.origin}${generatePath(
                FOOTBALL_USER_CARD_COLLECTION_CARDS,
                {
                  slug: userSlug,
                  collectionSlug: cardCollection.slug,
                }
              )}`}
              image={cardCollection.socialPictureUrls}
              renderButton={({ ShareButton, label, Icon }) => (
                <ShareButton
                  small
                  startIcon={<IconWrapper>{Icon}</IconWrapper>}
                >
                  {label}
                </ShareButton>
              )}
              trackingEventName="Share Collection"
              trackingEventContext={socialShareEventContext.COLLECTION}
            />
          </Ctas>
          <TeamInfos>
            {pictureUrl && <StyledImg src={pictureUrl} alt="" />}
            <RarityAndSeason>
              <Text16 bold>
                <ScarcityLabel scarcity={rarity || Rarity.custom_series} />
              </Text16>
              {season && (
                <Text16 bold color="var(--c-static-neutral-300)">
                  {season.name}
                </Text16>
              )}
            </RarityAndSeason>
            <StyledTitle2 as="h1">{name}</StyledTitle2>
            {user && (
              <UsernameWrapper>
                <User user={user} reverse />
              </UsernameWrapper>
            )}
          </TeamInfos>
          <CollectionHeaderStats
            teamShield={getCollectionsTeamShield(cardCollection)}
            slotsCount={slotsCount}
            fulfilledSlotsCount={fulfilledSlotsCount}
            score={score}
            bonus={bonus}
            liveRanking={liveRanking}
            showBonus={bonusThresholds.length > 0}
            showRanking
          />
        </InnerWrapper>
      </StyledContainer>
    </Root>
  );
};

Header.fragments = {
  cardCollection: gql`
    fragment Header_cardCollection on CardCollection {
      slug
      bannerPictureUrl
      rarity
      slotsCount
      bonusThresholds {
        bonus
      }
      socialPictureUrls(forUserSlug: $userSlug) {
        post
        square
        story
      }
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
      ...getCollectionsShield_cardCollection
    }
    ${getCollectionsTeamShield.fragments.cardCollection}
  ` as TypedDocumentNode<Header_cardCollection>,
  userCardCollection: gql`
    fragment Header_userCardCollection on UserCardCollection {
      id
      fulfilledSlotsCount
      score
      bonus
      liveRanking
      user {
        slug
        ...User_user
      }
    }
    ${User.fragments.user}
  ` as TypedDocumentNode<Header_userCardCollection>,
};
