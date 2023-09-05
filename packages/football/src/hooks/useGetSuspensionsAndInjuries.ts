import { TypedDocumentNode, gql } from '@apollo/client';

import {
  useGetSuspensionsAndInjuries_player,
  useGetSuspensionsAndInjuries_vicc5Score,
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
    game: useGetSuspensionsAndInjuries_vicc5Score['game']
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
  vicc5Score: gql`
    fragment useGetSuspensionsAndInjuries_vicc5Score on Vicc5Score {
      id
      game {
        id
        date
        competition {
          slug
        }
      }
    }
  ` as TypedDocumentNode<useGetSuspensionsAndInjuries_vicc5Score>,
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
  ` as TypedDocumentNode<useGetSuspensionsAndInjuries_player>,
};

export default useGetSuspensionsAndInjuries;
