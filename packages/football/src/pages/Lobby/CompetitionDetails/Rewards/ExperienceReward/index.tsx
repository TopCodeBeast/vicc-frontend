import { TypedDocumentNode, gql } from '@apollo/client';

import { Text16 } from '@sorare/core/src/atoms/typography';
import ExperienceIcon from '@sorare/core/src/components/rewards/ExperienceIcon';

import { HighlightedRewardRow } from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRow';

import { ExperienceReward_vicc5RewardExperience } from './__generated__/index.graphql';

type Props = {
  experience: ExperienceReward_vicc5RewardExperience;
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
  Vicc5RewardExperience: gql`
    fragment ExperienceReward_vicc5RewardExperience on Vicc5RewardExperience {
      description
      type
    }
  ` as TypedDocumentNode<ExperienceReward_vicc5RewardExperience>,
};

export default ExperienceReward;
