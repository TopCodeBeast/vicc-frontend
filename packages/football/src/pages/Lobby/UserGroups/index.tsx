import { gql } from '@apollo/client';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import { Title2, Title4 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import {
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  PrivateLeaguesStep,
} from '@sorare/core/src/constants/routes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';
import { theme } from '@sorare/core/src/style/theme';

import UserGroup from '@football/pages/Lobby/Components/UserGroup';
import CreateOrJoin from '@football/pages/Lobby/Components/UserGroup/CreateOrJoin';
import UserGroupDetails from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails';
import UserGroupDialog from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog';
import UserGroupJoinFromLinkDialog from '@football/pages/Lobby/Components/UserGroup/UserGroupJoinFromLinkDialog';

import { GetMyUserGroupsQuery } from './__generated__/index.graphql';

const PrivateLeaguesContainer = styled(Container)`
  padding: var(--double-unit) 0;
  background: var(--c-neutral-100);
  flex-grow: 1; /* Direct child of the main body to take the available space between header and footer */
  min-width: 0;
  color: var(--c-neutral-1000);
  @media (max-width: ${theme.breakpoints.values.tablet}px) {
    display: flex;
    flex-direction: column;
  }
`;
const Empty = styled.div`
  display: grid;
  grid-template-columns: 100%;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--triple-unit);
  text-align: center;
  margin: auto 0;
  @media ${tabletAndAbove} {
    grid-template-columns: 1fr 1fr;
  }
`;
const UserGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  width: 100%;
`;
const UserGroupHeader = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 var(--unit);
  @media ${tabletAndAbove} {
    padding: 0;
  }
`;
const Details = styled.div`
  position: sticky;
  bottom: 0;
  order: 1;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--unit);
  justify-content: flex-end;
  @media ${tabletAndAbove} {
    position: static;
    justify-content: space-between;
    order: unset;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  margin-right: var(--unit);
`;
const CreateButton = styled(Button)`
  position: sticky;
  bottom: 0;
  order: 1;
  z-index: 1;
`;
const JoinedCount = styled(Title4)`
  @media (max-width: ${theme.breakpoints.values.tablet}px) {
    display: none;
  }
`;
const Groups = styled.div`
  display: grid;
  grid-template-columns: 100%;
  gap: var(--triple-unit);
  row-gap: var(--triple-unit);
  width: 100%;
  padding: 0 var(--unit);
  @media ${tabletAndAbove} {
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
  }
`;

export const GET_MY_USERGROUPS_QUERY = gql`
  query GetMyUserGroupsQuery($after: String) {
    football {
      so5 {
        mySo5UserGroups(after: $after, first: 20) {
          nodes {
            slug
            id
            ...UserGroup_so5UserGroup
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
      }
    }
  }
  ${UserGroup.fragments.so5UserGroup}
`;

type Props = {
  showDialog?: boolean;
  showDetails?: boolean;
};

const LobbyUserGroups = ({ showDialog, showDetails }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const joinSecret = searchParams.get('code');
  const { data, loading, loadMore } = usePaginatedQuery<GetMyUserGroupsQuery>(
    GET_MY_USERGROUPS_QUERY,
    {
      connection: 'So5UserGroupConnection',
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    }
  );

  const groups = data?.football.so5.mySo5UserGroups;

  const after = groups?.pageInfo?.endCursor;
  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, { after });
    }, [loadMore, after]),
    Boolean(groups?.pageInfo?.hasNextPage),
    loading
  );

  const openCreateDialog = (step: PrivateLeaguesStep) => {
    navigate({
      pathname: generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATE, {
        step,
      }),
      search: searchParams.toString(),
    });
  };

  const mySo5UserGroups = groups?.nodes || [];
  const myLeaguesCount = groups?.totalCount || 0;

  return (
    <PrivateLeaguesContainer className="dark-theme">
      {data && (
        <UserGroupContainer>
          <UserGroupHeader>
            <Title2>
              <FormattedMessage
                id="UserGroups.Title"
                defaultMessage="My private leagues"
              />
            </Title2>
          </UserGroupHeader>
          {myLeaguesCount ? (
            <>
              <Details>
                <JoinedCount>
                  <FormattedMessage
                    id="UserGroups.Joined.Count"
                    defaultMessage="{count, plural, =0 {No league} one {# league} other {# leagues}}"
                    values={{ count: myLeaguesCount }}
                  />
                </JoinedCount>
                <CreateButton
                  medium
                  onClick={() => openCreateDialog(PrivateLeaguesStep.CREATE)}
                  color="blue"
                >
                  <Icon icon={faPlus} />
                  <FormattedMessage
                    id="UserGroups.CreateOrJoin"
                    defaultMessage="Create or join"
                  />
                </CreateButton>
              </Details>
              <Groups>
                {mySo5UserGroups.map(group => (
                  <UserGroup group={group} key={group.slug} />
                ))}
              </Groups>
            </>
          ) : (
            <Empty>
              <CreateOrJoin
                next={() => openCreateDialog(PrivateLeaguesStep.CREATE_FORM)}
              />
            </Empty>
          )}
        </UserGroupContainer>
      )}
      <InfiniteScrollLoader />
      {!!joinSecret && (
        <Dialog
          open
          maxWidth={false}
          onClose={() => navigate(FOOTBALL_PRIVATE_LEAGUES, { replace: true })}
          body={<UserGroupJoinFromLinkDialog joinSecret={joinSecret} />}
        />
      )}
      {showDialog && <UserGroupDialog />}
      {showDetails && <UserGroupDetails />}
    </PrivateLeaguesContainer>
  );
};

export default LobbyUserGroups;
