import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Vicc5State } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import ConfirmDialog from '@sorare/core/src/components/form/ConfirmDialog';
import { goToLobby } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import useConfirmLineups from '@football/hooks/so5/useConfirmLineups';
import useDeleteLineups from '@football/hooks/so5/useDeleteLineups';
import Teams from '@football/pages/Lobby/Components/Teams';

import {
  UpcomingTeamsSetupQuery,
  UpcomingTeamsSetupQueryVariables,
} from './__generated__/index.graphql';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--double-unit);
  margin-bottom: var(--double-and-a-half-unit);
  overflow: auto;
`;

const Actions = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
  color: var(--c-neutral-300);
  overflow: auto;
`;
const ModalTitle = styled(Title3)`
  text-align: center;
  margin-top: var(--double-and-a-half-unit);
  margin-bottom: var(--double-and-a-half-unit);
`;

const messages = defineMessages({
  add: {
    id: 'Lobby.Teams.Add',
    defaultMessage: 'Add a team',
  },
  delete: {
    id: 'Lobby.Teams.Delete',
    defaultMessage: 'Delete all',
  },
  deleteAllConfirmCta: {
    id: 'Lobby.Teams.Delete.confirm.cta',
    defaultMessage: 'Delete all',
  },
  confirm: {
    id: 'Lobby.Teams.Confirm',
    defaultMessage: 'Confirm all',
  },
  confirmed: {
    id: 'LobbyUpcomingTeams.Confirmed',
    defaultMessage: 'Confirmed',
  },
  draft: {
    id: 'LobbyUpcomingTeams.Unconfirmed',
    defaultMessage: 'Unconfirmed',
  },
  emptyTitle: {
    id: 'Lobby.Upcoming.Teams.Empty.title',
    defaultMessage: 'Quiet week',
  },
  emptyDescription: {
    id: 'Lobby.Upcoming.Teams.Empty.description',
    defaultMessage: "You didn't register any training team yet",
  },
});

export const UPCOMING_TEAMS_SETUP_QUERY = gql`
  query UpcomingTeamsSetupQuery {
    #football {
      vicc5Root {
        lineups: myUpcomingLineupsPaginated {
          totalCount
        }
        drafts: myUpcomingLineupsPaginated(draft: true) {
          totalCount
        }
        upcomingLeaderboards {
          slug
          teamsCap
          trainingCenter
          myVicc5Lineups {
            id
          }
          vicc5League {
            id
            slug
          }
        }
      }
    #}
  }
` as TypedDocumentNode<
  UpcomingTeamsSetupQuery,
  UpcomingTeamsSetupQueryVariables
>;

export const LobbyUpcomingTeams = () => {
  const navigate = useNavigate();
  const { teamsType } = useParams();
  const bgLocation = useBgLocation(true);
  const { formatMessage } = useIntlContext();
  const [loadingState, setLoadingState] = useState('');
  const [promptConfirmDelete, setPromptConfirmDelete] = useState(false);
  const confirmLineup = useConfirmLineups();
  const deleteLineups = useDeleteLineups();

  const { data, refetch, loading } = useQuery(UPCOMING_TEAMS_SETUP_QUERY, {
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const { lineups, drafts, upcomingLeaderboards } = data?.vicc5 || {};
  const totalLineups = lineups?.totalCount || 0;
  const totalDrafts = drafts?.totalCount || 0;

  const isOnDraft = teamsType === 'draft';
  const hasOnlyDraftLineups = totalLineups === totalDrafts;
  const hasLineups = totalLineups > 0 && (!loading || loadingState === 'done');

  const deleteOrConfirm = useCallback(
    async (actionType: 'delete' | 'confirm') => {
      setLoadingState(actionType);
      if (upcomingLeaderboards) {
        const lineupIds =
          upcomingLeaderboards.flatMap(({ myVicc5Lineups }) =>
            myVicc5Lineups.map(({ id }) => id)
          ) || [];
        if (actionType === 'delete') {
          await deleteLineups(
            upcomingLeaderboards.map(({ vicc5League }) => vicc5League.id),
            lineupIds
          );
        } else {
          await confirmLineup(lineupIds);
        }
        refetch();
      }
      setLoadingState('done');
    },
    [upcomingLeaderboards, refetch, deleteLineups, confirmLineup]
  );

  useEffect(() => {
    // when comming from a competition details dialog, we need to get the information
    // from the bgLocation object during navigation
    // from Lobby/CompetitionDetails/Teams/Actions
    const { state }: any = bgLocation;
    if (state && typeof state === 'object' && state.shouldRefetch) {
      refetch();
    }
  }, [bgLocation, refetch]);

  const shouldRedirectToDraftPage =
    !loading && totalLineups && hasOnlyDraftLineups && !isOnDraft;
  if (shouldRedirectToDraftPage) {
    return <Navigate to="draft" replace />;
  }

  const shouldRedirectToConfirmedPage = !loading && !totalDrafts && isOnDraft;
  if (shouldRedirectToConfirmedPage) {
    return <Navigate to="" replace />;
  }

  const buttonProperties = {
    url: goToLobby('upcoming'),
    message: formatMessage(messages.add),
    disabled: false,
  };

  return (
    <div>
      <Header>
        <StyledSecondaryTabs
          noBorder
          items={[
            {
              to: '',
              active: !teamsType,
              label: formatMessage(messages.confirmed),
              badge: totalLineups - totalDrafts,
              hide: !(totalLineups - totalDrafts),
            },
            {
              to: 'draft',
              active: isOnDraft,
              label: formatMessage(messages.draft),
              badge: totalDrafts,
              hide: !totalDrafts,
            },
          ]}
        />
        <Actions>
          {hasLineups && (
            <>
              <Button
                onClick={() => setPromptConfirmDelete(true)}
                type="button"
                small
                color="white"
              >
                {loadingState === 'delete' ? (
                  <LoadingIndicator smaller />
                ) : (
                  formatMessage(messages.delete)
                )}
              </Button>
              {isOnDraft && (
                <Button
                  onClick={() => {
                    deleteOrConfirm('confirm');
                  }}
                  type="button"
                  small
                  color="black"
                >
                  {loadingState === 'confirm' ? (
                    <LoadingIndicator smaller white />
                  ) : (
                    formatMessage(messages.confirm)
                  )}
                </Button>
              )}
              <ConfirmDialog
                open={promptConfirmDelete}
                onConfirm={() => {
                  deleteOrConfirm('delete');
                }}
                onClose={() => setPromptConfirmDelete(false)}
                title={
                  <ModalTitle>
                    <FormattedMessage
                      id="Lobby.Teams.Delete.confirm.title"
                      defaultMessage="Delete all teams"
                    />
                  </ModalTitle>
                }
                message={
                  <Text16 bold>
                    <FormattedMessage
                      id="Lobby.Teams.Delete.confirm.subtitle"
                      defaultMessage="Are you sure you want to delete all teams for this gameweek? This action can't be undone."
                    />
                  </Text16>
                }
                cta={formatMessage(messages.deleteAllConfirmCta)}
              />
              <svg width="1" height="15">
                <rect width="1" height="15" fill="currentColor" />
              </svg>
            </>
          )}
          <Button
            disabled={buttonProperties.disabled}
            small
            color="blue"
            onClick={() => navigate(buttonProperties.url)}
          >
            {buttonProperties.message}
          </Button>
        </Actions>
      </Header>
      <Teams
        emptyDescription={messages.emptyDescription}
        queryVariables={{
          type: Vicc5State.UPCOMING,
          slug: null,
          draft: isOnDraft,
        }}
        showRecommendedLeaderboard
      />
    </div>
  );
};
