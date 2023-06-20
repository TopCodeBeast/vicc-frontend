import { gql } from '@apollo/client';
import styled from 'styled-components';

import { CommonDraftCampaignStatus } from '@sorare/core/src/__generated__/globalTypes';
import { theme } from '@sorare/core/src/style/theme';

import { LeagueRow } from '@sorare/football/src/components/draft/LeagueRow';

import { LeaguePicker_onboardingCompetition } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${theme.radius.md}px;
  overflow: hidden;
`;

type Props = {
  onboardingCompetitions: LeaguePicker_onboardingCompetition[];
  onLeagueSelection: (campaignSlug: string) => void;
};

const isOpen = (
  draftCampaign: LeaguePicker_onboardingCompetition['commonDraftCampaign']
) => {
  return draftCampaign?.status === CommonDraftCampaignStatus.OPEN;
};

export const LeaguePicker = ({
  onLeagueSelection,
  onboardingCompetitions,
}: Props) => {
  const sortedCompetitions = [...onboardingCompetitions].sort((c1, c2) => {
    if (!isOpen(c1.commonDraftCampaign) && isOpen(c2.commonDraftCampaign)) {
      return 1;
    }
    if (isOpen(c1.commonDraftCampaign) && !isOpen(c2.commonDraftCampaign)) {
      return -1;
    }
    return 0;
  });

  return (
    <Wrapper>
      {sortedCompetitions.map(onboardingCompetition => {
        const { commonDraftCampaign, competition } = onboardingCompetition;

        return (
          <LeagueRow
            key={onboardingCompetition.slug}
            commonDraftCampaign={commonDraftCampaign}
            competition={competition}
            onClick={onLeagueSelection}
          />
        );
      })}
    </Wrapper>
  );
};

LeaguePicker.fragments = {
  onboardingCompetition: gql`
    fragment LeaguePicker_onboardingCompetition on OnboardingCompetition {
      slug
      commonDraftCampaign {
        slug
        status
        ...LeagueRow_commonDraftCampaign
      }
      competition {
        slug
        ...LeagueRow_competition
      }
    }
    ${LeagueRow.fragments.competition}
    ${LeagueRow.fragments.commonDraftCampaign}
  `,
};
