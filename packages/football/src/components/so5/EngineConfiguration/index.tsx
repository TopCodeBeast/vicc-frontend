import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { EngineConfiguration_so5Leaderboard } from './__generated__/index.graphql';

export const hasSpecialEngineConfiguration = (
  so5Leaderboard: EngineConfiguration_so5Leaderboard | undefined
) => {
  if (!so5Leaderboard?.engineConfiguration) return false;
  const { xpMultiplier } = so5Leaderboard.engineConfiguration;

  return (xpMultiplier || 1) > 1;
};

type Props = {
  so5Leaderboard?: EngineConfiguration_so5Leaderboard;
};

const EngineConfiguration = ({ so5Leaderboard }: Props) => {
  if (!hasSpecialEngineConfiguration(so5Leaderboard) || !so5Leaderboard)
    return null;

  const { engineConfiguration } = so5Leaderboard;

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
  so5Leaderboard: gql`
    fragment EngineConfiguration_so5Leaderboard on So5Leaderboard {
      slug
      engineConfiguration {
        xpMultiplier
      }
    }
  ` as TypedDocumentNode<EngineConfiguration_so5Leaderboard>,
};

export default EngineConfiguration;
