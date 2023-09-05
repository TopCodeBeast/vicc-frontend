import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { EngineConfiguration_vicc5Leaderboard } from './__generated__/index.graphql';

export const hasSpecialEngineConfiguration = (
  vicc5Leaderboard: EngineConfiguration_vicc5Leaderboard | undefined
) => {
  if (!vicc5Leaderboard?.engineConfiguration) return false;
  const { xpMultiplier } = vicc5Leaderboard.engineConfiguration;

  return (xpMultiplier || 1) > 1;
};

type Props = {
  vicc5Leaderboard?: EngineConfiguration_vicc5Leaderboard;
};

const EngineConfiguration = ({ vicc5Leaderboard }: Props) => {
  if (!hasSpecialEngineConfiguration(vicc5Leaderboard) || !vicc5Leaderboard)
    return null;

  const { engineConfiguration } = vicc5Leaderboard;

  return (
    <div>
      <FormattedMessage
        id="EngineConfiguration.xpMultiplier"
        defaultMessage="XP gains are multiplied by {value}"
        values={{ value: engineConfiguration.xpMultiplier }}
      />
    </div>
  );
};

EngineConfiguration.fragments = {
  vicc5Leaderboard: gql`
    fragment EngineConfiguration_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      engineConfiguration {
        xpMultiplier
      }
    }
  ` as TypedDocumentNode<EngineConfiguration_vicc5Leaderboard>,
};

export default EngineConfiguration;
