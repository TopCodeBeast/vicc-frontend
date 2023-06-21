import { gql } from '@apollo/client';

import PlayerUnavailabilityBadge from '@football/components/player/PlayerUnavailabilityBadge';

import { PlayerCurrentUnavailabilityBadge_player } from './__generated__/index.graphql';

type Props = {
  player: PlayerCurrentUnavailabilityBadge_player;
};
export const PlayerCurrentUnavailabilityBadge = ({
  player: { activeInjuries, activeSuspensions },
}: Props) => {
  return (
    <PlayerUnavailabilityBadge
      suspensions={activeSuspensions}
      injuries={activeInjuries}
    />
  );
};

PlayerCurrentUnavailabilityBadge.fragments = {
  player: gql`
    fragment PlayerCurrentUnavailabilityBadge_player on Player {
      slug
      activeInjuries {
        id
        ...PlayerUnavailabilityBadge_injury
      }
      activeSuspensions {
        id
        ...PlayerUnavailabilityBadge_suspension
      }
    }
    ${PlayerUnavailabilityBadge.fragments.suspension}
    ${PlayerUnavailabilityBadge.fragments.injury}
  `,
};

export default PlayerCurrentUnavailabilityBadge;
