import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_PLAYER_SHOW } from '@sorare/core/src/constants/routes';

import PlayerAvatar from '@football/components/player/PlayerAvatar';
import AverageScore from '@football/components/so5/AverageScore';

import { RelatedPlayers_player } from './__generated__/index.graphql';

type Props = {
  player: RelatedPlayers_player;
};

const messages = defineMessages({
  title: {
    id: 'RelatedPlayers.Title',
    defaultMessage: 'Related players',
  },
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const RelatedPlayerBlock = styled(Block)`
  display: flex;
  align-items: center;
  color: var(--c-neutral-1000);
`;

const Score = styled(Text14)`
  font-weight: var(--t-bold);
`;

const ActiveClub = styled(Text14)`
  color: var(--c-neutral-600);
`;

const Label = styled.div`
  flex: 1;
  margin-left: var(--double-unit);
`;

const RelatedPlayers = ({ player }: Props) => {
  if (!player.relatedPlayers.length) return null;

  return (
    <Container>
      <Title6 as="h2">
        <FormattedMessage {...messages.title} />
      </Title6>
      <div>
        {player.relatedPlayers.map(
          relatedPlayer =>
            relatedPlayer && (
              <RelatedPlayerBlock
                border="around"
                key={relatedPlayer.slug}
                to={generatePath(FOOTBALL_PLAYER_SHOW, {
                  slug: relatedPlayer.slug,
                })}
              >
                <PlayerAvatar player={relatedPlayer} />
                <Label>
                  <Title6>{relatedPlayer.displayName}</Title6>
                  {relatedPlayer.activeClub && (
                    <ActiveClub>{relatedPlayer.activeClub.name}</ActiveClub>
                  )}
                </Label>
                <Score>
                  <AverageScore
                    score={relatedPlayer.lastFiveSo5AverageScore}
                    withTooltip
                    scoreMode="AVERAGE_LAST_5_GAMES"
                  />
                </Score>
              </RelatedPlayerBlock>
            )
        )}
      </div>
    </Container>
  );
};

RelatedPlayers.fragments = {
  player: gql`
    fragment RelatedPlayers_player on Player {
      slug
      displayName
      relatedPlayers {
        slug
        ...FootballPlayerAvatar_player
        lastFiveSo5AverageScore: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE)
        activeClub {
          slug
          name
        }
      }
    }
    ${PlayerAvatar.fragments.player}
  ` as TypedDocumentNode<RelatedPlayers_player>,
};

export default RelatedPlayers;
