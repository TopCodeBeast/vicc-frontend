import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text14 } from '@sorare/core/src/atoms/typography';
import LearnCompetitionsOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/LearnCompetitionsOnboardingTask';
import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  LearnCompetitionsOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import CompetitionRules from '@football/components/competition/CompetitionRules';
import PrizePoolOverview from '@football/components/competition/PrizePoolOverview';
import EngineConfiguration, {
  hasSpecialEngineConfiguration,
} from '@football/components/so5/EngineConfiguration';
import { MissingCardsMessage } from '@football/components/unlockCompetition/MissingCardsMessage';
import { useDisplaySemiProIncentive } from '@football/hooks/leaderboard/useDisplaySemiProIncentive';

import DetailsSection from './DetailsSection';
import {
  CompetitionDetailsDefaultTabQuery,
  CompetitionDetailsDefaultTabQueryVariables,
} from './__generated__/index.graphql';

const COMPETITION_DETAILS_DEFAULT_TAB_QUERY = gql`
  query CompetitionDetailsDefaultTabQuery($slug: String!) {
    #football {
      vicc5 {
        vicc5Leaderboard(slug: $slug) {
          slug
          title
          displayName
          description
          vicc5LeaderboardType
          canCompose {
            ...MissingCardsMessage_validity
          }
          vicc5League {
            slug
            name
          }
          totalRewards {
            ...PrizePoolOverview_rewardsOverview
          }
          rewardsConfig {
            ...PrizePoolOverview_leaderboardRewardsConfig
          }
          ...EngineConfiguration_vicc5Leaderboard
          #...CompetitionRules_vicc5Leaderboard
        }
      }
    #}
  }
  ${EngineConfiguration.fragments.vicc5Leaderboard}
  ${PrizePoolOverview.fragments.leaderboardRewardsConfig}
  ${PrizePoolOverview.fragments.rewardsOverview}
  #{CompetitionRules.fragments.vicc5Leaderboard}
  ${MissingCardsMessage.fragments.validity}
` as TypedDocumentNode<
  CompetitionDetailsDefaultTabQuery,
  CompetitionDetailsDefaultTabQueryVariables
>;

const messages = defineMessages({
  description: {
    id: 'Lobby.CompetitionDetails.Description',
    defaultMessage: 'Description',
  },
  coverage: {
    id: 'Lobby.CompetitionDetails.Details',
    defaultMessage: 'Competitions covered',
  },
  requirements: {
    id: 'Lobby.CompetitionDetails.Requirements',
    defaultMessage: 'Requirements',
  },
  specialRules: {
    id: 'Lobby.CompetitionDetails.SpecialRules',
    defaultMessage: 'Special rules',
  },
  eligibilities: {
    id: 'Lobby.CompetitionDetails.Eligibilities',
    defaultMessage: 'Eligibilities',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  padding-bottom: var(--double-unit);
`;

const NotificationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const CompetitionDetailsDefaultTab = () => {
  const { step, setStep, setTask, onSuccessCallback } = useManagerTaskContext();
  const { showNotification } = useSnackNotificationContext();
  const { competition } = useParams();

  const { loading, data } = useQuery(COMPETITION_DETAILS_DEFAULT_TAB_QUERY, {
    variables: {
      slug:
        // FIXME undefined case is improperly handled
        competition ?? '',
    },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const vicc5Leaderboard = data?.football.vicc5.vicc5Leaderboard;
  const hasSpecialRules = hasSpecialEngineConfiguration(vicc5Leaderboard);

  const displaySemiProIncentive = useDisplaySemiProIncentive(
    vicc5Leaderboard?.vicc5LeaderboardType
  );

  if (!vicc5Leaderboard && loading) return <LoadingIndicator grow />;

  return (
    <Wrapper>
      <ManagerTaskTooltip
        disable={LearnCompetitionsOnboardingStep.rewards !== step}
        name={LearnCompetitionsOnboardingStep.rewards}
        title={
          <LearnCompetitionsOnboardingTask
            name={LearnCompetitionsOnboardingStep.rewards}
            onClick={() => {
              setStep(LearnCompetitionsOnboardingStep.requirements);
            }}
          />
        }
      >
        <PrizePoolOverview
          rewardsConfig={vicc5Leaderboard?.rewardsConfig}
          totalRewards={vicc5Leaderboard?.totalRewards}
          displaySemiProIncentive={displaySemiProIncentive}
          vicc5LeaderboardSlug={vicc5Leaderboard?.slug}
        />
      </ManagerTaskTooltip>

      {vicc5Leaderboard && (
        <ManagerTaskTooltip
          disable={LearnCompetitionsOnboardingStep.requirements !== step}
          name={LearnCompetitionsOnboardingStep.requirements}
          title={
            <LearnCompetitionsOnboardingTask
              name={LearnCompetitionsOnboardingStep.requirements}
              tip={
                <Text14 color="var(--c-yellow-800)">
                  <span>🌟 </span>
                  <MissingCardsMessage validity={vicc5Leaderboard.canCompose} />
                </Text14>
              }
              onClick={() => {
                setTask();
                setStep();
                onSuccessCallback?.();
                showNotification(
                  'learnCompetitionsSuccess',
                  {
                    notification: (...chunks: string[]) => (
                      <NotificationContainer>
                        <ScarcityIcon size="lg" scarcity={Rarity.limited} />
                        <div>{chunks}</div>
                      </NotificationContainer>
                    ),
                    success: (...chunks: string[]) => (
                      <Text14 color="var(--c-static-green-300)">
                        {chunks}
                      </Text14>
                    ),
                  },
                  {
                    level: Level.INFO,
                    autoHideDuration: null,
                  }
                );
              }}
            />
          }
        >
          <CompetitionRules vicc5Leaderboard={vicc5Leaderboard} />
        </ManagerTaskTooltip>
      )}
      {vicc5Leaderboard && hasSpecialRules && (
        <DetailsSection title={messages.specialRules}>
          <EngineConfiguration vicc5Leaderboard={vicc5Leaderboard} />
        </DetailsSection>
      )}
    </Wrapper>
  );
};

export default CompetitionDetailsDefaultTab;
