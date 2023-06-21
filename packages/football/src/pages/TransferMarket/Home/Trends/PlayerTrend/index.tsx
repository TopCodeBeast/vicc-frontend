import { gql } from '@apollo/client';
import styled from 'styled-components';

import {
  FeaturedPageDuration,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { LEGACY_PLAYER_SHOW } from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import { Trend } from '@football/pages/TransferMarket/Home/Trends/Trend';
import {
  TrendDescription,
  TrendTitle,
} from '@football/pages/TransferMarket/Home/Trends/ui';

import { PlayerTrend_player } from './__generated__/index.graphql';

type Props = {
  player?: PlayerTrend_player;
  timeframe: FeaturedPageDuration;
};

const ImgContainer = styled.div`
  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 20px;
    background: linear-gradient(
      180deg,
      rgba(var(--c-rgb-neutral-100), 0) 0%,
      rgba(var(--c-rgb-neutral-100), 1) 100%
    );
    bottom: 0;
  }
`;

export const PlayerTrend = ({ player, timeframe }: Props) => {
  const { generateSportPath } = useSportContext();
  const track = useEvents();

  if (!player) return null;

  const playerDescription = `${
    player.activeClub?.domesticLeague
      ? `${player.activeClub?.domesticLeague.displayName} • `
      : ''
  }${player.activeClub?.name}`;

  return (
    <Trend
      to={generateSportPath(LEGACY_PLAYER_SHOW, {
        params: { slug: player.slug },
        sport: Sport.FOOTBALL,
      })}
      onClick={() =>
        track('Click Market Trend', {
          trend: 'sales',
          slug: player.slug,
          timeframe,
        })
      }
      img={
        player.squaredPictureUrl && (
          <ImgContainer>
            <img src={player.squaredPictureUrl} alt={player.displayName} />
          </ImgContainer>
        )
      }
      infos={
        <>
          <TrendTitle title={player.displayName}>
            {player.displayName}
          </TrendTitle>
          {player.activeClub && (
            <TrendDescription title={playerDescription}>
              {playerDescription}
            </TrendDescription>
          )}
        </>
      }
    />
  );
};

PlayerTrend.fragments = {
  player: gql`
    fragment PlayerTrend_player on Player {
      slug
      displayName
      squaredPictureUrl: pictureUrl(derivative: "squared")
      activeClub {
        slug
        name
        domesticLeague {
          slug
          displayName
        }
      }
    }
  `,
};
