import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text14, caption } from '@sorare/core/src/atoms/typography';
import { playerGameStatusLabels } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import TeamAvatar from '@football/components/club/TeamAvatar';
import { NoGameLabel } from '@football/components/stats/PlayingLabel';
import { isGameCancelled } from '@football/lib/so5';

import { ProLayer_card } from './__generated__/index.graphql';

const Root = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-bottom-left-radius: var(--unit);
  border-bottom-right-radius: var(--unit);
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
  background-color: var(--c-static-neutral-100);
  color: var(--c-static-neutral-600);
  padding: var(--intermediate-unit);
`;

const NextGameWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--unit);
`;

const Avatar = styled(TeamAvatar)`
  width: var(--triple-unit);
  height: var(--triple-unit);
`;

const ScoresWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: var(--t-bold);
  @media ${tabletAndAbove} {
    ${caption};
    font-weight: var(--t-bold);
  }
`;

const ScoreWrapper = styled.span`
  color: var(--c-static-neutral-1000);
  &.negative {
    color: var(--c-red-600);
  }
`;

interface Props {
  card: ProLayer_card;
}

const NextGame = ({ game }: { game: ProLayer_card['gameForLeague'] }) => {
  if (!game || isGameCancelled(game.status)) return <NoGameLabel />;

  return (
    <NextGameWrapper>
      <Avatar team={game.homeTeam} withTooltip />
      <span>VS</span>
      <Avatar team={game.awayTeam} withTooltip />
    </NextGameWrapper>
  );
};

const Score = ({
  so5Score,
}: {
  so5Score: ProLayer_card['player']['so5Scores'][number];
}) => {
  const { formatMessage } = useIntl();

  if (so5Score?.score == null) {
    return (
      <span>{formatMessage(playerGameStatusLabels.did_not_play_short)}</span>
    );
  }
  const { id, score } = so5Score;

  return (
    <ScoreWrapper className={classnames({ negative: score < 0 })} key={id}>
      {Math.round(score)}
    </ScoreWrapper>
  );
};

const Scores = ({
  so5Scores,
}: {
  so5Scores: ProLayer_card['player']['so5Scores'];
}) => {
  const { formatMessage } = useIntl();

  if (!so5Scores) {
    return (
      <ScoresWrapper>
        {formatMessage(playerGameStatusLabels.did_not_play_short)};
      </ScoresWrapper>
    );
  }

  return (
    <ScoresWrapper>
      {so5Scores.map((score, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Score so5Score={score} key={index} />
      ))}
    </ScoresWrapper>
  );
};

export const ProLayer = ({ card }: Props) => {
  const {
    gameForLeague: game,
    player: { so5Scores },
  } = card;

  return (
    <Root>
      <Text14 bold as="div">
        <NextGame game={game} />
      </Text14>
      <Scores so5Scores={so5Scores} />
    </Root>
  );
};

ProLayer.fragments = {
  card: gql`
    fragment ProLayer_card on Card {
      slug
      assetId
      player {
        slug
        so5Scores(last: 5) {
          id
          score
        }
      }
      gameForLeague(so5LeaderboardSlug: $so5LeaderboardSlug) {
        id
        status
        homeTeam {
          ... on TeamInterface {
            slug
            ...TeamAvatar_team
          }
        }
        awayTeam {
          ... on TeamInterface {
            slug
            ...TeamAvatar_team
          }
        }
      }
    }
    ${TeamAvatar.fragments.team}
  ` as TypedDocumentNode<ProLayer_card>,
};

export default ProLayer;
