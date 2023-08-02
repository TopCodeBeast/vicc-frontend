import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { AveragePlayerScore } from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';

import PlayerCurrentUnavailabilityBadge from '@football/components/player/PlayerCurrentUnavailabilityBadge';
import AverageScore from '@football/components/so5/AverageScore';
import CardBonus from '@football/components/so5/CardProperties/CardBonus';
import Context from '@football/components/so5/ComposeTeam/Context';
import { cardFragment } from '@football/components/so5/ComposeTeam/ContextProvider';
import { ContextProvider_so5Lineup } from '@football/components/so5/ComposeTeam/ContextProvider/__generated__/index.graphql';
import { CompactNextGames } from '@football/components/so5/ComposeTeam/responsive/CompactNextGames';
import { hasBonuses, positionShortNames } from '@football/lib/so5';

import { BenchCard_card } from './__generated__/index.graphql';

type ContextProvider_so5Lineup_so5Appearances_card =
  ContextProvider_so5Lineup['so5Appearances'][number]['card'];

interface Props {
  card: BenchCard_card | ContextProvider_so5Lineup_so5Appearances_card;
  children?: ReactNode;
  showBonus?: boolean;
}

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--intermediate-unit);
`;

const CardImgWrapper = styled.div`
  border-radius: var(--unit);
  overflow: hidden;
  flex-shrink: 0;
  width: 50px;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
  justify-content: space-around;
`;

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const PlayerNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: var(--half-unit);
`;

const Properties = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

export const BenchCard = (props: Props) => {
  const { card, children, showBonus } = props;

  const { displayedAverageScore, so5Leaderboard, isCappedMode } =
    useContext(Context)!;
  return (
    <Root>
      <CardImgWrapper>
        <CardImg src={card.pictureUrl || ''} alt="" width={80} />
      </CardImgWrapper>
      <CardInfo>
        <CenterContent>
          <Properties>
            <>
              {displayedAverageScore ===
                AveragePlayerScore.LAST_FIFTEEN_SO5_AVERAGE_SCORE && (
                <AverageScore
                  capped={isCappedMode}
                  size="smaller"
                  score={card.lastFifteenSo5AverageScore}
                  withTooltip
                  scoreMode="AVERAGE_LAST_15_GAMES"
                />
              )}
              {displayedAverageScore ===
                AveragePlayerScore.LAST_FIVE_SO5_AVERAGE_SCORE && (
                <AverageScore
                  capped={isCappedMode}
                  size="smaller"
                  score={card.lastFiveSo5AverageScore}
                  withTooltip
                  scoreMode="AVERAGE_LAST_5_GAMES"
                />
              )}
            </>
            {hasBonuses(so5Leaderboard) && (
              <CardBonus card={card} showBonus={showBonus} />
            )}
            <PlayerCurrentUnavailabilityBadge player={card.player} />
          </Properties>
          <PlayerNameWrapper>
            <Text14>{card.player.displayName}</Text14>
            {positionShortNames[card.position] && (
              <Text14 color="var(--c-neutral-500)">
                <FormattedMessage {...positionShortNames[card.position]} />
              </Text14>
            )}
          </PlayerNameWrapper>
          <CompactNextGames card={card} />
          {children}
        </CenterContent>
      </CardInfo>
    </Root>
  );
};

BenchCard.fragments = {
  card: gql`
    fragment BenchCard_card on Card {
      slug
      assetId
      rarity
      pictureUrl: pictureUrl(derivative: "tinified")
      position: positionTyped
      lastFiveSo5AverageScore: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE)
      lastFifteenSo5AverageScore: averageScore(
        type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
      )
      player {
        slug
        displayName
        ...PlayerCurrentUnavailabilityBadge_player
      }

      ...CardBonus_WithEngine_card
      ...ContextProvider_card
      ...CompactNextGames_card
    }
    ${CardBonus.fragments.cardWithEngine}
    ${cardFragment}
    ${PlayerCurrentUnavailabilityBadge.fragments.player}
    ${CompactNextGames.fragments.card}
  ` as TypedDocumentNode<BenchCard_card>,
};

export default BenchCard;
