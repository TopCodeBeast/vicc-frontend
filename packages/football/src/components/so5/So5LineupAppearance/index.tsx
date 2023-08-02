import { gql } from '@apollo/client';
import { Collapse } from '@material-ui/core';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import useToggle from '@sorare/core/src/hooks/useToggle';

import FlexCard from '@football/components/card/FlexCard';
import AppearanceDetailsFull from '@football/components/so5/AppearanceDetailsFull';
import Captain from '@football/components/so5/Captain';
import CardBonus from '@football/components/so5/CardProperties/CardBonus';
import Points from '@football/components/so5/Points';
import PlayerScore from '@football/components/stats/PlayerScore';
import ScoreFrom from '@football/components/stats/ScoreFrom';
import { getPlayerScore } from '@football/lib/so5';

import { So5LineupAppearance_so5Appearance } from './__generated__/index.graphql';

type Props = {
  so5Appearance: So5LineupAppearance_so5Appearance;
};

const CaptainBadge = styled.div`
  position: absolute;
  top: -6px;
  left: -6px;
  --size: 16px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid var(--c-neutral-300);
`;
const AppearanceContent = styled.div`
  padding: var(--double-unit);
  display: flex;
  width: 100%;
  cursor: pointer;
`;
const CardBlock = styled(OpenItemDialogLink)`
  display: flex;
  align-items: center;
`;
const Card = styled.div`
  margin-right: 20px;
  position: relative;
  width: 40px;
`;
const AppearanceRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-self: center;
`;
const ScoreBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ScoreAndBonus = styled.div`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 5px;
  }
`;
const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
`;

export const So5LineupAppearance = ({ so5Appearance }: Props) => {
  const [expanded, toggleExpanded] = useToggle(false);

  const { card, bonus, captain, so5Score } = so5Appearance;
  const { score, status } = getPlayerScore(so5Score);
  const scoreWithBonus = bonus && score ? score * bonus : null;
  const { player } = card;
  const representativePlayer = so5Score?.playerGameStats?.player;

  const onAppearanceClick = () => toggleExpanded();

  return (
    <Root>
      <AppearanceContent
        onClick={onAppearanceClick}
        role="button"
        tabIndex={0}
        aria-hidden="true"
      >
        <CardBlock item={card} sport={Sport.FOOTBALL}>
          <Card>
            <FlexCard card={card} width={80} />
            {captain && (
              <CaptainBadge>
                <Captain active />
              </CaptainBadge>
            )}
          </Card>
        </CardBlock>
        <AppearanceRight>
          <ScoreBlock>
            <ScoreAndBonus>
              <PlayerScore size="smaller" score={score} status={status} />
              <CardBonus
                card={card}
                captain={captain}
                bonusOverride={bonus ? bonus - 1 : undefined}
              />
            </ScoreAndBonus>
            <Text16 color="var(--c-neutral-600)" bold>
              <Points score={scoreWithBonus} />
            </Text16>
          </ScoreBlock>
          <NameBlock>
            <Text16>{player.displayName}</Text16>
            {representativePlayer &&
              representativePlayer.slug !== player.slug && (
                <ScoreFrom player={representativePlayer} />
              )}
          </NameBlock>
        </AppearanceRight>
      </AppearanceContent>
      {so5Score && (
        <Collapse in={expanded}>
          <AppearanceDetailsFull so5Score={so5Score} player={player} />
        </Collapse>
      )}
    </Root>
  );
};

So5LineupAppearance.fragments = {
  so5Appearance: gql`
    fragment So5LineupAppearance_so5Appearance on Vicc5Appearance {
      id
      captain
      bonus
      card {
        slug
        assetId
        player {
          slug
          displayName
          position: positionTyped
          ...AppearanceDetailsFull_player
        }
        ...FlexCard_card
        ...CardBonus_card
      }
      so5Score: vicc5Score {
        id
        score
        playerGameStats {
          id
          player {
            slug
            displayName
          }
        }
        ...AppearanceDetailsFull_so5Score
        ...getPlayerScore_so5Score
      }
    }
    ${FlexCard.fragments.card}
    ${CardBonus.fragments.card}
    ${AppearanceDetailsFull.fragments.so5Score}
    ${AppearanceDetailsFull.fragments.player}
    ${getPlayerScore.fragments.so5Score}
  `,
};

export default So5LineupAppearance;
