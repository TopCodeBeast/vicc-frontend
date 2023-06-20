import { gql } from '@apollo/client';

import {
  useGetSuspensionsAndInjuries_player,
  useGetSuspensionsAndInjuries_so5Score,
} from './__generated__/useGetSuspensionsAndInjuries.graphql';

const useGetSuspensionsAndInjuries = (
  player?: useGetSuspensionsAndInjuries_player
) => {
  const useGetSuspensionsAndInjuriesCallback = <
    T extends {
      suspensions: useGetSuspensionsAndInjuries_player['suspensions'];
      injuries: useGetSuspensionsAndInjuries_player['injuries'];
    }
  >(
    game: useGetSuspensionsAndInjuries_so5Score['game']
  ): {
    suspensions: T['suspensions'];
    injuries: T['injuries'];
  } => {
    const suspensions = (player?.suspensions || []).filter(suspension => {
      return (
        suspension.competition.slug === game.competition.slug &&
        suspension.startDate < game.date &&
        (!suspension.endDate || suspension.endDate > game.date)
      );
    });
    const injuries = (player?.injuries || []).filter(injury => {
      return (
        injury.startDate &&
        injury.startDate < game.date &&
        (!injury.expectedEndDate || injury.expectedEndDate > game.date)
      );
    });
    return { suspensions, injuries };
  };

  return useGetSuspensionsAndInjuriesCallback;
};

useGetSuspensionsAndInjuries.fragments = {
  so5Score: gql`
    fragment useGetSuspensionsAndInjuries_so5Score on So5Score {
      id
      game {
        id
        date
        competition {
          slug
        }
      }
    }
  `,
  player: gql`
    fragment useGetSuspensionsAndInjuries_player on Player {
      slug
      injuries {
        id
        startDate
        expectedEndDate
      }
      suspensions {
        id
        competition {
          slug
          id
        }
        startDate
        endDate
      }
    }
  `,
};

export default useGetSuspensionsAndInjuries;
