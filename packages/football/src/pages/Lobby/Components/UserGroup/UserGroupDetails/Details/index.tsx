import { gql } from '@apollo/client/core';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16, Title3, button16 } from '@sorare/core/src/atoms/typography';
import ConfirmDialog from '@sorare/core/src/components/form/ConfirmDialog';
import { FOOTBALL_PRIVATE_LEAGUES } from '@sorare/core/src/constants/routes';
import {
  CurrentUser,
  useCurrentUserContext,
} from '@sorare/core/src/contexts/currentUser';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { glossary } from '@sorare/core/src/lib/glossary';

import useDeleteSo5UserGroup from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/useDeleteSo5UserGroup';
import useRemoveSo5UserFromGroup from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/useRemoveSo5UserFromGroup';

import Edit from './Edit';
import ScoringPeriod, { Section, SectionTitle } from './ScoringPeriod';
import Share from './Share';
import { GetUserGroupDetailsTabQuery } from './__generated__/index.graphql';

const DeleteButton = styled(Button).attrs({
  type: 'button',
  medium: true,
  stroke: true,
  color: 'red',
})`
  ${button16};
  margin-top: var(--double-unit);
`;
const Cta = styled.span`
  ${button16};
`;
const GrayBackground = styled.div`
  color: var(--c-neutral-600);
  background-color: var(--c-neutral-300);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  text-align: center;
`;
const Subtitle = styled(Text16)`
  color: var(--c-neutral-600);
`;

const GET_USERGROUP_DETAILS_TAB_QUERY = gql`
  query GetUserGroupDetailsTabQuery($slug: String!) {
    so5: vicc5Root {
      so5UserGroup: vicc5UserGroup(slug: $slug) {
        id
        slug
        displayName
        description
        joinSecret
        joinDisabled
        logo {
          id
          pictureUrl
        }
        startSo5Fixture: startVicc5Fixture {
          slug
          id
          gameWeek
          startDate
          displayName
          shortDisplayName
        }
        startGameWeek
        endSo5Fixture: endVicc5Fixture {
          slug
          id
          endDate
          displayName
        }
        endGameWeek
        upcomingSo5Leaderboard: upcomingVicc5Leaderboard {
          slug
          displayName
        }
        myMembership {
          id
          administrator
        }
        so5TournamentType: vicc5TournamentType {
          id
          so5LeaderboardType: vicc5LeaderboardType
        }
      }
    }
  }
`;

type Props = { slug: string };

const Details = ({ slug }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const removeSo5UserFromGroup = useRemoveSo5UserFromGroup(true);
  const deleteSo5UserGroup = useDeleteSo5UserGroup();
  const [loadingState, setLoadingState] = useState<'' | 'delete' | 'leave'>('');
  const [userToRemove, setUserToRemove] = useState<CurrentUser | null>(null);
  const [shouldDeleteGroup, setShouldDeleteGroup] = useState(false);

  const { data, loading } = useQuery<GetUserGroupDetailsTabQuery>(
    GET_USERGROUP_DETAILS_TAB_QUERY,
    {
      variables: { slug },
    }
  );
  const group = data?.football.so5.so5UserGroup;
  const so5UserGroupId = group?.id || '';
  const isAdmin = group?.myMembership?.administrator;

  const leaveUserGroup = useCallback(
    async (user: CurrentUser | null) => {
      if (so5UserGroupId && user) {
        setLoadingState('leave');
        const removed = await removeSo5UserFromGroup(
          {
            userId: user.id,
            so5UserGroupId,
          },
          null
        );
        setLoadingState('');
        if (!removed?.errors) {
          navigate(FOOTBALL_PRIVATE_LEAGUES, { replace: true });
        }
      }
    },
    [navigate, removeSo5UserFromGroup, so5UserGroupId]
  );

  const deleteUserGroup = useCallback(() => {
    if (so5UserGroupId) {
      setLoadingState('delete');
      deleteSo5UserGroup({ so5UserGroupId }).then(() => {
        setLoadingState('');
        navigate(FOOTBALL_PRIVATE_LEAGUES, { replace: true });
      });
    }
  }, [deleteSo5UserGroup, so5UserGroupId, navigate]);

  return (
    <div>
      {loading && <LoadingIndicator small />}
      {group && (
        <>
          {!isAdmin && group?.description && (
            <Section>
              <Subtitle>{group?.description}</Subtitle>
            </Section>
          )}
          <Section>
            <SectionTitle>
              <FormattedMessage
                id="UserGroupDetails.Details.Invite"
                defaultMessage="Invite new members"
              />
            </SectionTitle>
            {group.joinDisabled ? (
              <GrayBackground>
                <FormattedMessage
                  id="UserGroupDetails.Details.InviteDisabled"
                  defaultMessage="Invitations are currently disabled by administrator"
                />
              </GrayBackground>
            ) : (
              <Share
                joinSecret={group.joinSecret}
                so5UserGroupId={so5UserGroupId}
                so5LeaderboardType={group.so5TournamentType.so5LeaderboardType}
              />
            )}
          </Section>

          {isAdmin ? (
            <Section>
              <SectionTitle>
                <FormattedMessage
                  id="UserGroupDetails.Details.Information"
                  defaultMessage="Information"
                />
              </SectionTitle>

              <Edit
                UserGroupId={so5UserGroupId}
                displayName={group.displayName}
                description={group.description || ''}
                pictureUrl={group?.logo?.pictureUrl || ''}
                joinDisabled={group.joinDisabled}
                Scoring={<ScoringPeriod group={group} />}
              />
            </Section>
          ) : (
            <ScoringPeriod group={group} />
          )}

          {isAdmin ? (
            <Section>
              <SectionTitle>
                <FormattedMessage
                  id="UserGroupDetails.Details.Delete.Title"
                  defaultMessage="Delete league"
                />
              </SectionTitle>
              <Subtitle>
                <FormattedMessage
                  id="UserGroupDetails.Details.Delete.Subtitle"
                  defaultMessage="Permanently destroy your Sorare league. This cannot be undone."
                />
              </Subtitle>
              <DeleteButton onClick={() => setShouldDeleteGroup(true)}>
                {loadingState === 'delete' ? (
                  <LoadingIndicator smaller />
                ) : (
                  <FormattedMessage
                    id="UserGroupDetails.Details.Delete.Cta"
                    defaultMessage="Delete league"
                  />
                )}
              </DeleteButton>
              <ConfirmDialog
                open={shouldDeleteGroup}
                onConfirm={deleteUserGroup}
                onClose={() => setShouldDeleteGroup(false)}
                title={<Title3>{group?.displayName}</Title3>}
                message={
                  <Subtitle>
                    <FormattedMessage
                      id="UserGroupDetails.Details.Delete.Confirm.Subtitle"
                      defaultMessage="Are you sure you want to delete league {group}?"
                      values={{ group: group?.displayName }}
                    />
                  </Subtitle>
                }
                cta={
                  <Cta>
                    <FormattedMessage {...glossary.delete} />
                  </Cta>
                }
                ctaProps={{ color: 'red' }}
              />
            </Section>
          ) : (
            <Section>
              <SectionTitle>
                <FormattedMessage
                  id="UserGroupDetails.Details.Leave.Title"
                  defaultMessage="Leave league"
                />
              </SectionTitle>
              <Subtitle>
                <FormattedMessage
                  id="UserGroupDetails.Details.Leave.Subtitle"
                  defaultMessage="You will lose your progression"
                />
              </Subtitle>
              <DeleteButton
                onClick={() => currentUser && setUserToRemove(currentUser)}
              >
                {loadingState === 'leave' ? (
                  <LoadingIndicator smaller />
                ) : (
                  <FormattedMessage
                    id="UserGroupDetails.Details.Leave.Cta"
                    defaultMessage="Leave league"
                  />
                )}
              </DeleteButton>
              <ConfirmDialog
                open={!!userToRemove}
                onConfirm={() => {
                  leaveUserGroup(userToRemove);
                }}
                onClose={() => setUserToRemove(null)}
                title={<Title3>{group?.displayName}</Title3>}
                message={
                  <Subtitle>
                    <FormattedMessage
                      id="UserGroupDetails.Details.Leave.Confirm.Subtitle"
                      defaultMessage="Are you sure you want to leave {group}?"
                      values={{ group: group?.displayName }}
                    />
                  </Subtitle>
                }
                cta={
                  <Cta>
                    <FormattedMessage
                      id="UserGroupDetails.Details.Leave.Confirm.Cta"
                      defaultMessage="Leave"
                    />
                  </Cta>
                }
                ctaProps={{ color: 'red' }}
              />
            </Section>
          )}
        </>
      )}
    </div>
  );
};

export default Details;
