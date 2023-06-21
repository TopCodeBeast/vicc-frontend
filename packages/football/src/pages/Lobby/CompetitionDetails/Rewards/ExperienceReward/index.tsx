import { gql } from '@apollo/client';

import { Text16 } from '@sorare/core/src/atoms/typography';
import ExperienceIcon from '@sorare/core/src/components/rewards/ExperienceIcon';

import { HighlightedRewardRow } from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRow';

import { ExperienceReward_so5RewardExperience } from './__generated__/index.graphql';

type Props = {
  experience: ExperienceReward_so5RewardExperience;
};
const ExperienceReward = ({ experience: { description, type } }: Props) => {
  return (
    <HighlightedRewardRow>
      <ExperienceIcon type={type} sm />
      <Text16>{description}</Text16>
    </HighlightedRewardRow>
  );
};

ExperienceReward.fragments = {
  So5RewardExperience: gql`
    fragment ExperienceReward_so5RewardExperience on So5RewardExperience {
      description
      type
    }
  `,
};

export default ExperienceReward;
