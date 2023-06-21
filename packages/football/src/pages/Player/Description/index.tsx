import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import {
  Collection,
  Position,
} from '@sorare/core/src/__generated__/globalTypes';
import { theme } from '@sorare/core/src/style/theme';

import PlayerPriceHistory from '@sorare/marketplace/src/components/price/PlayerPriceHistory';

import PlayerLastScores from '@football/components/stats/PlayerLastScores';
import CardSupply from '@football/pages/Player/CardSupply';
import Career from '@football/pages/Player/Career';
import CareerStats from '@football/pages/Player/CareerStats';
import LastGames from '@football/pages/Player/LastGames';
import PlayerOnSorare from '@football/pages/Player/PlayerOnSorare';
import RelatedPlayers from '@football/pages/Player/RelatedPlayers';
import UpcomingGames from '@football/pages/Player/UpcomingGames';

import { Description_player } from './__generated__/index.graphql';

type Props = {
  player: Description_player;
  setPosition: (position?: Position) => void;
  selectedPosition?: Position;
  InfiniteScrollLoader?: ReactNode;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  gap: 20px;
  padding: 0;
  color: var(--c-neutral-1000);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    flex-direction: row;
  }
`;
const Left = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    max-width: 320px;
    width: 100%;
  }
`;

const Description = ({
  player,
  setPosition,
  selectedPosition,
  InfiniteScrollLoader,
}: Props) => {
  return (
    <Root>
      <Left>
        <PlayerLastScores
          player={player}
          selectedPosition={selectedPosition}
          setPosition={setPosition}
          InfiniteScrollLoader={InfiniteScrollLoader}
        />
        <PlayerPriceHistory
          playerSlug={player.slug}
          collection={Collection.FOOTBALL}
        />
        <UpcomingGames player={player} />
        <LastGames player={player} />
        <Career player={player} />
      </Left>
      <Right>
        <PlayerOnSorare player={player} />
        <CardSupply player={player} />
        <CareerStats player={player} />
        <RelatedPlayers player={player} />
      </Right>
    </Root>
  );
};

Description.fragments = {
  player: gql`
    fragment Description_player on Player {
      slug
      ...PlayerLastScores_player
      ...LastGames_player
      ...UpcomingGames_player
      ...CareerStats_player
      ...Career_player
      ...CardSupply_player
      ...PlayerOnSorare_player
      ...RelatedPlayers_player
    }
    ${PlayerLastScores.fragments.player}
    ${LastGames.fragments.player}
    ${UpcomingGames.fragments.player}
    ${CareerStats.fragments.player}
    ${Career.fragments.player}
    ${CardSupply.fragments.player}
    ${PlayerOnSorare.fragments.player}
    ${RelatedPlayers.fragments.player}
  `,
};

export default Description;
