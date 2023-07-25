import { gql } from '@apollo/client';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import classNames from 'classnames';
import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Container from '@sorare/core/src/atoms/layout/Container';
import { Caption, Text16, Title2 } from '@sorare/core/src/atoms/typography';
import { Bonus } from '@sorare/core/src/components/collections/Bonus';
import ProgressBar from '@sorare/core/src/components/collections/ProgressBar';
import { Score } from '@sorare/core/src/components/collections/Score';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import User from '@sorare/core/src/components/user/User';
import {
  FOOTBALL_USER_CARD_COLLECTION_CARDS,
  FOOTBALL_USER_GALLERY_CARD_COLLECTIONS,
} from '@sorare/core/src/constants/routes';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { socialShareEventContext } from '@sorare/core/src/lib/events';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { CardsNumber } from '@football/components/collections/CardsNumber';
import { Ranking } from '@football/components/collections/Ranking';
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
const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--triple-unit);
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  @media ${tabletAndAbove} {
    gap: calc(8 * var(--unit));
    &.noBonus {
      justify-content: flex-start;
    }
  }
`;
const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
`;
const ProgressBarWrapper = styled.div`
  min-width: 100%;
  @media ${laptopAndAbove} {
    flex-grow: 1;
    min-width: 0;
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

type HeaderStatsProps = {
  cardCollection: Header_cardCollection;
  userCardCollection?: Header_userCardCollection | null;
  slotsCount: number;
  showBonus: boolean;
};
const HeaderStats = ({
  cardCollection,
  userCardCollection,
  slotsCount,
  showBonus,
}: HeaderStatsProps) => {
  const defaults = {
    fulfilledSlotsCount: 0,
    bonus: 0,
    score: 0,
    liveRanking: 0,
  };

  const { fulfilledSlotsCount, bonus, score, liveRanking } =
    userCardCollection || defaults;
  return (
    <Stats className={classNames({ noBonus: !showBonus })}>
      <StatBox>
        <Caption bold color="var(--c-static-neutral-600)">
          <FormattedMessage {...glossary.cards} />
        </Caption>
        <CardsNumber ownedCards={fulfilledSlotsCount} totalCards={slotsCount} />
      </StatBox>
      <StatBox>
        <Caption bold color="var(--c-static-neutral-600)">
          <FormattedMessage {...fantasy.rank} />
        </Caption>
        <Ranking liveRanking={liveRanking} />
      </StatBox>
      <StatBox>
        <Caption bold color="var(--c-static-neutral-600)">
          <FormattedMessage {...fantasy.score} />
        </Caption>
        <Score score={score} />
      </StatBox>
      {showBonus && (
        <>
          <StatBox>
            <Caption bold color="var(--c-static-neutral-600)">
              <FormattedMessage {...fantasy.bonus} />
            </Caption>
            <Bonus bonus={bonus} />
          </StatBox>
          <ProgressBarWrapper>
            <ProgressBar score={score} cardCollection={cardCollection} />
          </ProgressBarWrapper>
        </>
      )}
    </Stats>
  );
};

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
  const { user } = userCardCollection || {};

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
          <HeaderStats
            cardCollection={cardCollection}
            userCardCollection={userCardCollection}
            slotsCount={slotsCount}
            showBonus={bonusThresholds.length > 0}
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
      ...ProgressBar_cardCollection
    }
    ${ProgressBar.fragments.cardCollection}
  `,
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
  `,
};
