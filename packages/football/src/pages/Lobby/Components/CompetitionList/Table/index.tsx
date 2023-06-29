import { gql } from '@apollo/client';
import { FC, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Table, TableHeader } from '@sorare/core/src/components/data/Table';
import LearnCompetitionsOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/LearnCompetitionsOnboardingTask';
import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import {
  FOOTBALL_CLUB_SHOP_BOOSTS,
  FOOTBALL_COMPETITION_DETAILS_DETAILS,
} from '@sorare/core/src/constants/routes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  LearnCompetitionsOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import { Link } from '@sorare/core/src/routing/Link';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import ListItemAction from '@football/pages/Lobby/Components/CompetitionListActions/ListItemAction';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import TableRow, { Areas } from './TableRow';
import {
  CompetitionListTable_clubShopItem,
  CompetitionListTable_so5Leaderboard,
} from './__generated__/index.graphql';

type LeaderboardTeam = {
  lineupId: number;
  leaderboard: CompetitionListTable_so5Leaderboard;
  rowCta?: ReactNode;
};

const findDraftedSemiPro = (
  leaderboardsSemiPro: LeaderboardTeam[],
  draftedLeaderboard: LeaderboardTeam
) => {
  return leaderboardsSemiPro.find(({ leaderboard: { so5LeaderboardType } }) => {
    const semiProType = so5LeaderboardType.replace('_SEMI_PRO', '');
    const amateurType =
      draftedLeaderboard?.leaderboard.so5LeaderboardType.replace(
        '_AMATEUR',
        ''
      );
    return semiProType === amateurType;
  });
};
const findOpenedDraftedSemiPro = (
  leaderboardsSemiPro: LeaderboardTeam[],
  leaderboardTeams: LeaderboardTeam[]
) => {
  return leaderboardsSemiPro.find(
    ({ leaderboard: { so5LeaderboardType: semiProType } }) =>
      leaderboardTeams.find(
        ({ leaderboard: { so5LeaderboardType: amateurType } }) => {
          return (
            amateurType.replace('_AMATEUR', '') ===
            semiProType.replace('_SEMI_PRO', '')
          );
        }
      )
  );
};

const Root = styled(Table)`
  --columns: calc(5 * var(--unit)) 1fr max-content;
  --areas: '${Areas.logo} ${Areas.nameAndScarcity} ${Areas.status}'
    '${Areas.participantsAndRewards} ${Areas.participantsAndRewards} ${Areas.participantsAndRewards}'
    '${Areas.prize} ${Areas.prize} ${Areas.prize}'
    '${Areas.cta} ${Areas.cta} ${Areas.cta}';
  @media ${laptopAndAbove} {
    --columns: var(--triple-unit) var(--quadruple-unit) 1.5fr 0.5fr 1fr 70px
      1.25fr;
    --areas: '${Areas.status} ${Areas.logo} ${Areas.name} ${Areas.scarcity} ${Areas.rewards} ${Areas.participants} ${Areas.cta}'
      '. ${Areas.prize} ${Areas.prize} ${Areas.prize} ${Areas.prize} ${Areas.prize} ${Areas.prize}';
  }
  & > :last-child {
    border: none;
  }
`;

const RowCtaWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding: 0 0 var(--unit) 0;
  @media ${tabletAndAbove} {
    padding: 0 var(--intermediate-unit);
  }
`;

const HighLightRow: FC<{
  step: LearnCompetitionsOnboardingStep;
  show: boolean;
  onClick: () => void;
  messageValues?: Partial<Record<'competitionName', ReactNode>>;
}> = ({ children, step, show, messageValues, onClick }) => {
  return show ? (
    <ManagerTaskTooltip
      name={step}
      title={
        <LearnCompetitionsOnboardingTask
          name={step}
          onClick={onClick}
          messageValues={messageValues}
        />
      }
    >
      {children}
    </ManagerTaskTooltip>
  ) : (
    <>{children}</>
  );
};

type Props = {
  onSortChange: (sortBy?: { id: string; descending: boolean }) => void;
  refetch: () => void;
  defaultSortBy?: {
    id: string;
    descending: boolean;
  };
  leaderboards: CompetitionListTable_so5Leaderboard[];
  extraTeamsCapItems: Nullable<CompetitionListTable_clubShopItem[]>;
  header: TableHeader;
};

export const CompetitionListTable = ({
  onSortChange,
  defaultSortBy,
  leaderboards,
  header,
  refetch,
  extraTeamsCapItems,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { step, setStep } = useManagerTaskContext();
  const leaderboardTeams = leaderboards.reduce<LeaderboardTeam[]>(
    (acc, leaderboard) => {
      const { teamsCap, mySo5Lineups } = leaderboard;
      const rowsNbToDisplay =
        mySo5Lineups.length + 1 < (teamsCap || 0)
          ? mySo5Lineups.length + 1
          : teamsCap;

      const teams: LeaderboardTeam[] = new Array(rowsNbToDisplay)
        .fill(0)
        .map((_, i) => ({
          leaderboard,
          lineupId: i,
        }));
      const canBuyExtraTeams = extraTeamsCapItems?.some(
        ({ myPurchasesCount }) => !myPurchasesCount
      );
      if (
        canBuyExtraTeams &&
        leaderboard.trainingCenter &&
        mySo5Lineups.length === teamsCap
      ) {
        teams.push({
          leaderboard,
          lineupId: (teamsCap || 0) + 1,
          rowCta: (
            <RowCtaWrapper>
              <ListItemAction
                color="blue"
                fullWidth
                component={Link}
                to={FOOTBALL_CLUB_SHOP_BOOSTS}
              >
                <FormattedMessage
                  id="Lobby.Upcoming.Teams.GetExtraTeam"
                  defaultMessage="Get an extra team"
                />
              </ListItemAction>
            </RowCtaWrapper>
          ),
        });
      }
      return acc.concat(teams);
    },
    []
  );
  const draftedLeaderboard = leaderboardTeams.find(
    ({ leaderboard: { commonDraftCampaign } }) =>
      commonDraftCampaign?.campaignType === 'ONBOARDING'
  );
  const leaderboardsSemiPro = leaderboardTeams.filter(
    ({ leaderboard: { so5LeaderboardType } }) =>
      /_SEMI_PRO$/.test(so5LeaderboardType)
  );
  const draftedLeaderboardSemiPro =
    (draftedLeaderboard &&
      findDraftedSemiPro(leaderboardsSemiPro, draftedLeaderboard)) ||
    findOpenedDraftedSemiPro(leaderboardsSemiPro, leaderboardTeams) ||
    leaderboardsSemiPro[0];
  const semiProLeaderboardSlug: string | undefined =
    draftedLeaderboardSemiPro?.leaderboard.slug;

  return (
    <Root
      defaultSortBy={defaultSortBy}
      onSortChange={onSortChange}
      rows={{
        header,
        body: leaderboardTeams.map(({ leaderboard, lineupId, rowCta }) => {
          const showLobbyTaskRow =
            step === LearnCompetitionsOnboardingStep.lobby &&
            leaderboard.slug === draftedLeaderboard?.leaderboard.slug;
          const showLobbyProTaskRow =
            step === LearnCompetitionsOnboardingStep.lobby_pro &&
            leaderboard.slug === semiProLeaderboardSlug;

          return (
            <HighLightRow
              step={
                showLobbyTaskRow
                  ? LearnCompetitionsOnboardingStep.lobby
                  : LearnCompetitionsOnboardingStep.lobby_pro
              }
              messageValues={
                showLobbyProTaskRow
                  ? {
                      competitionName: leaderboard.displayName,
                    }
                  : undefined
              }
              key={`${leaderboard.slug}-${lineupId}`}
              show={showLobbyTaskRow || showLobbyProTaskRow}
              onClick={() => {
                if (showLobbyTaskRow) {
                  setStep(LearnCompetitionsOnboardingStep.lobby_pro);
                } else if (semiProLeaderboardSlug) {
                  setStep(LearnCompetitionsOnboardingStep.rewards);
                  navigate(
                    generatePath(FOOTBALL_COMPETITION_DETAILS_DETAILS, {
                      competition: semiProLeaderboardSlug,
                    }),
                    { state: { backgroundState: location } }
                  );
                }
              }}
            >
              <TableRow
                so5Leaderboard={leaderboard}
                onActionSuccess={refetch}
                lineupId={lineupId}
                rowCta={rowCta}
              />
            </HighLightRow>
          );
        }),
      }}
    />
  );
};

CompetitionListTable.fragments = {
  so5Leaderboard: gql`
    fragment CompetitionListTable_so5Leaderboard on So5Leaderboard {
      slug
      so5LeaderboardType
      ...TableRow_so5Leaderboard
    }
    ${TableRow.fragments.so5Leaderboard}
  `,
  clubShopItem: gql`
    fragment CompetitionListTable_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        myPurchasesCount
      }
    }
  `,
};
