import { gql } from '@apollo/client';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Title3 } from '@sorare/core/src/atoms/typography';

import PlayerListItem from '@sorare/football/src/components/player/PlayerListItem';

import { RewardPool_Data_playerWithSupply } from './__generated__/index.graphql';

const messages = defineMessages({
  noCards: {
    id: 'Rewards.noCards',
    defaultMessage: 'No Cards available',
  },
  remainingCards: {
    id: 'Rewards.remainingCards',
    defaultMessage: '{supply} left',
  },
});

interface Props {
  rarity: Rarity;
  players: RewardPool_Data_playerWithSupply[];
}

const Supply = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  color: var(--c-green-600);
  &.empty {
    color: var(--c-neutral-600);
  }
  &.last {
    color: var(--c-red-600);
  }
`;

export const Data = ({ rarity, players }: Props) => {
  const remainingSupply = (player: RewardPool_Data_playerWithSupply) => {
    if (rarity === 'common') return null;

    return player.availableSupply;
  };

  if (!players.length)
    return (
      <Title3 color="var(--c-neutral-1000)">
        <FormattedMessage {...messages.noCards} />
      </Title3>
    );

  return (
    <div>
      {players.map(s => {
        const supply = remainingSupply(s);
        const { player } = s;
        return (
          <PlayerListItem
            key={player.slug}
            player={player}
            subtitle={player.activeClub?.name}
          >
            {supply !== null ? (
              <Supply
                className={classnames({
                  last: supply && supply <= 3,
                  empty: supply === 0,
                })}
              >
                <FormattedMessage
                  {...messages.remainingCards}
                  values={{ supply }}
                />
              </Supply>
            ) : undefined}
          </PlayerListItem>
        );
      })}
    </div>
  );
};

Data.fragments = {
  playerWithSupply: gql`
    fragment RewardPool_Data_playerWithSupply on PlayerWithSupply {
      slug
      availableSupply
      player {
        slug
        activeClub {
          slug
          name
        }
        ...PlayerListItem_player
      }
    }
    ${PlayerListItem.fragments.player}
  `,
};

export default Data;
