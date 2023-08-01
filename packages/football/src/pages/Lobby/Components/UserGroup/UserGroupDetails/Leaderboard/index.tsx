import { gql } from '@apollo/client/core';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { CommonDraftCampaignStatus } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Select from '@sorare/core/src/atoms/inputs/Select';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { UnlockCta } from '@sorare/core/src/components/lobby/LineupActions/UnlockCta';
import {
  FOOTBALL_DRAFT,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';

import GreyRow from '@football/components/so5/Leaderboard/GreyRow';
import { UnlockButtonAction, useFootballEvents } from '@football/lib/events';
import MainLeaderboard from '@football/pages/Lobby/CompetitionDetails/Leaderboards/Main';
import { UnlockCompetition } from '@football/pages/Lobby/Components/UnlockCompetition';
import UserGroupLeaderboardPaginated from '@football/pages/Lobby/Components/UserGroup/UserGroupLeaderboardPaginated';

import { GetUserGroupUpcomingLeaderboardTabQuery } from './__generated__/index.graphql';

const GreyRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);

  & > *:last-child {
    margin-bottom: var(--double-unit);
  }
`;
const PastLeaderboardSelect = styled.div`
  margin-bottom: var(--double-unit);
`;

const GET_USERGROUP_UPCOMING_LEADERBOARD_QUERY = gql`
  query GetUserGroupUpcomingLeaderboardTabQuery($slug: String!, $page: Int) {
    so5: vicc5Root {
      so5UserGroup: vicc5UserGroup(slug: $slug) {
        slug
        upcomingSo5Leaderboard: upcomingVicc5Leaderboard {
          slug
          displayName
          rarityType
          so5Fixture: vicc5Fixture {
            slug
            displayName
          }
          mySo5Lineups: myVicc5Lineups {
            id
            draft
          }
          canCompose {
            value
          }
          commonDraftCampaign {
            slug
            status
          }
          ...UnlockCompetition_so5Leaderboard
        }
        membershipsPaginated(page: $page) {
          totalCount
        }
        pastSo5Leaderboards: pastVicc5Leaderboards {
          nodes {
            slug
            so5Fixture: vicc5Fixture {
              slug
              displayName
            }
          }
        }
        ...UserGroupLeaderboardPaginated_so5UserGroup
      }
    }
  }
  ${UserGroupLeaderboardPaginated.fragments.so5UserGroup}
  ${UnlockCompetition.fragments.so5Leaderboard}
`;

const messages = defineMessages({
  registerMessage: {
    id: 'lobby.sorareCup.userGroupDetails.leaderboard.noTeamRegistered',
    defaultMessage: 'Register your team for <strong>{nextMatchDay}</strong>',
  },
  noPastSo5Leaderboard: {
    id: 'lobby.sorareCup.userGroupDetails.leaderboard.noPastSo5Leaderboard',
    defaultMessage: 'Overall',
  },
});

type Props = { slug: string };
const UserGroupDetailsLeaderboard = ({ slug }: Props) => {
  const [{ leaderboardPage: page = '0' }, onChangePage] = useQueryState({
    leaderboardPage: undefined as string | undefined,
  });
  const { data, loading } = useQuery<GetUserGroupUpcomingLeaderboardTabQuery>(
    GET_USERGROUP_UPCOMING_LEADERBOARD_QUERY,
    {
      variables: { slug, page: +page },
      fetchPolicy: 'cache-and-network',
    }
  );
  const track = useFootballEvents();

  const group = data?.football.so5.so5UserGroup;
  const upcomingLeaderboard = group?.upcomingSo5Leaderboard;
  const joined = upcomingLeaderboard?.mySo5Lineups?.some(
    lineup => !lineup.draft
  );
  const canCompose = upcomingLeaderboard?.canCompose.value;
  const registerUrl =
    upcomingLeaderboard?.commonDraftCampaign?.status ===
    CommonDraftCampaignStatus.OPEN
      ? generatePath(FOOTBALL_DRAFT, { slug: upcomingLeaderboard.slug })
      : getComposeTeamRoute({
          so5LeaderboardSlug: upcomingLeaderboard?.slug || '',
        });
  const nextMatchDay = upcomingLeaderboard?.so5Fixture.displayName;

  const {
    flags: { useSo5UserGroupsPastLeaderboards = false },
  } = useFeatureFlags();
  const { formatMessage } = useIntlContext();
  const noPastSo5LeaderboardsOption = {
    value: 'overall',
    label: formatMessage(messages.noPastSo5Leaderboard),
  };
  const [selectedPastSo5LeaderboardSlug, setSelectedPastSo5LeaderboardSlug] =
    useState(noPastSo5LeaderboardsOption.value);
  const [pastPage, setPastPage] = useState('1');
  // TODO[WC-661]: Lazy load next pastSo5Leaderboards pages when select scrolled to bottom
  const pastSo5LeaderboardsOptions =
    data?.football.so5.so5UserGroup.pastSo5Leaderboards.nodes.map(
      so5Leaderboard => ({
        label: so5Leaderboard.so5Fixture.displayName,
        value: so5Leaderboard.slug,
      })
    );
  pastSo5LeaderboardsOptions?.unshift(noPastSo5LeaderboardsOption);

  return (
    <div>
      <GreyRows>
        {!joined && canCompose && nextMatchDay && (
          <GreyRow
            url={registerUrl}
            message={
              <FormattedMessage
                {...messages.registerMessage}
                tagName="span"
                values={{ strong: Bold, nextMatchDay }}
              />
            }
            button={
              <Button fullWidth color="blue" medium>
                <FormattedMessage
                  id="lobby.sorareCup.userGroupDetails.leaderboard.register"
                  defaultMessage="Register"
                />
              </Button>
            }
          />
        )}
        {!joined && !canCompose && nextMatchDay && (
          <GreyRow
            message={
              <FormattedMessage
                {...messages.registerMessage}
                values={{ strong: Bold, nextMatchDay }}
              />
            }
            button={
              <UnlockCompetition
                so5Leaderboard={upcomingLeaderboard!}
                Cta={UnlockCta}
                onClickTracking={(action: UnlockButtonAction) => {
                  track('Click Unlock Button', {
                    action,
                    leaderboardName: upcomingLeaderboard.displayName,
                    leaderboardRarity: upcomingLeaderboard.rarityType,
                    leaderboardSlug: upcomingLeaderboard.slug,
                  });
                }}
              />
            }
          />
        )}
      </GreyRows>
      {pastSo5LeaderboardsOptions?.length &&
        useSo5UserGroupsPastLeaderboards && (
          <PastLeaderboardSelect>
            <Select
              isDisabled={pastSo5LeaderboardsOptions.length === 1}
              onChange={selected => {
                if (selected)
                  setSelectedPastSo5LeaderboardSlug(selected?.value);
              }}
              value={pastSo5LeaderboardsOptions?.find(
                it => it.value === selectedPastSo5LeaderboardSlug
              )}
              options={pastSo5LeaderboardsOptions}
              icon={faAngleDown}
            />
          </PastLeaderboardSelect>
        )}
      {selectedPastSo5LeaderboardSlug === noPastSo5LeaderboardsOption.value ? (
        <UserGroupLeaderboardPaginated
          group={data?.football.so5.so5UserGroup}
          loading={loading}
          onChangePage={onChangePage}
        />
      ) : (
        <MainLeaderboard
          page={pastPage}
          setPage={({ page: p }) => p && setPastPage(p)}
          Header={() => null}
          so5LeaderboardSlug={selectedPastSo5LeaderboardSlug}
          so5UserGroupSlug={slug}
        />
      )}
    </div>
  );
};

export default UserGroupDetailsLeaderboard;
