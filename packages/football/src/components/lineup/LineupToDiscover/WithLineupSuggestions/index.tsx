import { gql } from '@apollo/client';
import { faArrowRight, faRefresh } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import { FOOTBALL_TRANSFER_MARKET } from '@sorare/core/src/constants/routes';
import { glossary } from '@sorare/core/src/lib/glossary';

import { CardPlaceholder } from '@football/components/lineup/CardPlaceholder';
import { Props as LineupProps } from '@football/components/lineup/Lineup';
import { useFootballEvents } from '@football/lib/events';

import BuyButton from './BuyButton';
import { CommonPlayerCard } from './CommonPlayerCard';
import SuggestionCard from './SuggestionCard';
import {
  WithLineupSuggestions_card,
  WithLineupSuggestions_draftablePlayer,
  WithLineupSuggestions_so5Leaderboard,
} from './__generated__/index.graphql';

const SuggestionCardWrapper = styled.div`
  position: relative;
  &.loading {
    opacity: 0.6;
  }
`;

const ButtonRows = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  &.disabled {
    color: var(--c-neutral-600);
  }
`;

type Props = {
  liveCardsOnSale: WithLineupSuggestions_card[] | undefined;
  children: (props: Partial<LineupProps>) => JSX.Element;
  draftedPlayers: WithLineupSuggestions_draftablePlayer[];
  fetchMoreCardsOnSale: () => void;
  isLastCardsOnSalePage: boolean;
  leagueFilter: string;
  loading: boolean;
  so5Leaderboard: WithLineupSuggestions_so5Leaderboard;
  onPaymentSuccess: () => void;
};

const WithLineupSuggestions = ({
  liveCardsOnSale: baseLiveCardsOnSale,
  children,
  fetchMoreCardsOnSale,
  isLastCardsOnSalePage,
  leagueFilter,
  draftedPlayers,
  loading,
  so5Leaderboard,
  onPaymentSuccess,
}: Props) => {
  const track = useFootballEvents();
  const [liveCardsOnSale, setLiveCardsOnSale] = useState(baseLiveCardsOnSale);
  // ensure liveCardsOnSale are not undefined between algolia page load
  // to keep animation
  if (baseLiveCardsOnSale?.length && liveCardsOnSale !== baseLiveCardsOnSale) {
    setLiveCardsOnSale(baseLiveCardsOnSale);
  }

  const [shufflePosition, setShufflePosition] = useState(0);
  useEffect(() => {
    setShufflePosition(0);
  }, [liveCardsOnSale]);

  const suggestionCard = liveCardsOnSale?.[shufflePosition];

  const disableShuffle =
    isLastCardsOnSalePage &&
    shufflePosition >= (liveCardsOnSale?.length || 0) - 1;

  const marketUrl = generatePath(
    `${FOOTBALL_TRANSFER_MARKET}?${qs.stringify({
      [SEARCH_PARAMS.SORT]: 'Best Value',
      [SEARCH_PARAMS.RARITY]: Rarity.limited,
      [SEARCH_PARAMS.LEAGUE_FILTER]: leagueFilter,
    })}`
  );
  return children({
    renderCard: ({ appearance }) => {
      const lineupPosition = appearance.card.position;

      if (lineupPosition === 'Extra Player') {
        if (!suggestionCard) {
          return (
            <SuggestionCardWrapper>
              <CardPlaceholder
                rarity={Rarity.limited}
                locked
                available={false}
                empty
              />
            </SuggestionCardWrapper>
          );
        }
        return (
          <SuggestionCardWrapper className={classNames({ loading })}>
            <SuggestionCard card={suggestionCard} />
          </SuggestionCardWrapper>
        );
      }
      const playerForPosition = draftedPlayers?.find(
        draftedPlayer => draftedPlayer?.position === lineupPosition
      );

      return <CommonPlayerCard draftablePlayer={playerForPosition} />;
    },
    renderCta: suggestionCard
      ? () => {
          return (
            <>
              <ButtonRows>
                <StyledButton
                  small
                  color="transparent"
                  className={classNames({
                    disabled: disableShuffle,
                  })}
                  onClick={() => {
                    if (disableShuffle) {
                      return;
                    }
                    track('Click Shuffle Card To Discover', {
                      league: leagueFilter,
                    });
                    if (shufflePosition >= (liveCardsOnSale?.length || 0) - 1) {
                      fetchMoreCardsOnSale();
                      return;
                    }
                    setShufflePosition(p => p + 1);
                  }}
                >
                  <FontAwesomeIcon icon={faRefresh} size="sm" />
                  <Text14 bold>
                    <FormattedMessage {...glossary.shuffle} />
                  </Text14>
                </StyledButton>
                <StyledButton
                  small
                  color="transparent"
                  component={Link}
                  onClick={() => {
                    track('Redirect To Marketplace', {
                      leaderboardSlug: so5Leaderboard.slug,
                      leaderboardName: so5Leaderboard.displayName,
                      leaderboardRarity: so5Leaderboard.rarityType,
                      destination: marketUrl,
                    });
                  }}
                  to={marketUrl}
                >
                  <Text14 bold>
                    <FormattedMessage
                      id="WithLineupSuggestions.viewMorePlayers"
                      defaultMessage="View more players"
                    />
                  </Text14>
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </StyledButton>
              </ButtonRows>
              <BuyButton
                token={suggestionCard.token}
                loading={loading}
                onPaymentSuccess={onPaymentSuccess}
              />
            </>
          );
        }
      : undefined,
  });
};

WithLineupSuggestions.fragments = {
  card: gql`
    fragment WithLineupSuggestions_card on Card {
      slug
      assetId
      token {
        assetId
        slug
        liveSingleSaleOffer {
          id
        }
        ...BuyButton_token
      }
      ...SuggestionCard_card
    }
    ${BuyButton.fragments.token}
    ${SuggestionCard.fragments.card}
  `,
  draftablePlayer: gql`
    fragment WithLineupSuggestions_draftablePlayer on DraftablePlayer {
      id
      position: positionTyped
      player {
        slug
        averageScore(type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE)
      }
      ...CommonPlayerCard_draftablePlayer
    }
    ${CommonPlayerCard.fragments.draftablePlayer}
  `,
  so5Leaderboard: gql`
    fragment WithLineupSuggestions_so5Leaderboard on Vicc5Leaderboard {
      slug
      displayName
      rarityType
    }
  `,
};

export default WithLineupSuggestions;
