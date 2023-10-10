import { TypedDocumentNode, gql } from '@apollo/client';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Link,
  generatePath,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title2, Title4 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import {
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  FOOTBALL_PRIVATE_LEAGUES_PRIVATE,
  FOOTBALL_PRIVATE_LEAGUES_PUBLIC,
  PrivateLeaguesStep,
} from '@sorare/core/src/constants/routes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import PrivateUserGroupDialog from '@football/components/userGroup/private/Dialog';
import EmptyStateCta from '@football/components/userGroup/private/EmptyStateCta';
import JoinFromLinkDialog from '@football/components/userGroup/private/JoinFromLinkDialog';
import PrivateUserGroup from '@football/components/userGroup/private/PrivateUserGroup';
import PublicUserGroup from '@football/components/userGroup/public/PublicUserGroup';

import {
  GetMyPrivateUserGroupsQuery,
  GetMyPrivateUserGroupsQueryVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--double-unit) 0;
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;
const UserGroupHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    flex-direction: row;
    align-items: center;
  }
`;
const Titles = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 var(--unit);
  @media ${tabletAndAbove} {
    padding: 0;
  }
`;
const Details = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: var(--unit) 0;
  justify-content: space-between;
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
const Groups = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--triple-unit);
  row-gap: var(--triple-unit);
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(2, 1fr);
    padding: 0;
  }
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const GET_MY_PRIVATE_USER_GROUPS_QUERY = gql`
  query GetMyPrivateUserGroupsQuery(
    $enableLongFormatCompetition: Boolean!
    $after: String
  ) {
    #football {
      vicc5Root {
        myVicc5UserGroups(first: 8) @include(if: $enableLongFormatCompetition) {
          nodes {
            slug
            id
            ...PrivateUserGroup_vicc5UserGroup
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
        universalVicc5UserGroups(first: 8)
          @include(if: $enableLongFormatCompetition) {
          nodes {
            slug
            id
            ...PublicUserGroup_vicc5UserGroup
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
        paginatedMyVicc5UserGroups: myVicc5UserGroups(after: $after, first: 8)
          @skip(if: $enableLongFormatCompetition) {
          nodes {
            slug
            id
            ...PrivateUserGroup_vicc5UserGroup
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
      }
    #}
  }
  ${PrivateUserGroup.fragments.vicc5UserGroup}
  ${PublicUserGroup.fragments.vicc5UserGroup}
` as TypedDocumentNode<
  GetMyPrivateUserGroupsQuery,
  GetMyPrivateUserGroupsQueryVariables
>;

type Props = {
  showDialog?: boolean;
};
const UserGroupsList = ({ showDialog }: Props) => {
  const {
    flags: { enableLongFormatCompetition = false },
  } = useFeatureFlags();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const joinSecret = searchParams.get('code');
  const { data, loading, loadMore } = usePaginatedQuery<
    GetMyPrivateUserGroupsQuery,
    GetMyPrivateUserGroupsQueryVariables
  >(GET_MY_PRIVATE_USER_GROUPS_QUERY, {
    connection: 'Vicc5UserGroupConnection',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      enableLongFormatCompetition,
    },
  });

  const after =
    data?.vicc5Root.paginatedMyVicc5UserGroups?.pageInfo?.endCursor;
  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, { after, enableLongFormatCompetition });
    }, [loadMore, after, enableLongFormatCompetition]),
    Boolean(data?.vicc5Root.paginatedMyVicc5UserGroups?.pageInfo?.hasNextPage),
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

  const privateUserGroups = data?.vicc5Root.myVicc5UserGroups?.nodes || [];
  const publicUserGroups =
    data?.vicc5Root.universalVicc5UserGroups?.nodes || [];
  const paginatedPrivateUserGroups =
    data?.vicc5Root.paginatedMyVicc5UserGroups?.nodes || [];
  const privateUserGroupsTotal =
    data?.vicc5Root.myVicc5UserGroups?.totalCount || 0;
  const paginatedPrivateUserGroupsTotal =
    data?.vicc5Root.paginatedMyVicc5UserGroups?.totalCount || 0;
  const publicUserGroupsTotal =
    data?.vicc5Root.universalVicc5UserGroups?.totalCount || 0;

  return (
    <Root>
      {data && (
        <FlexColContainer>
          <UserGroupHeader>
            <Titles>
              {enableLongFormatCompetition ? (
                <>
                  <Title2 color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="UserGroupsList.Title"
                      defaultMessage="Long Format"
                    />
                  </Title2>
                  <Text16 color="var(--c-neutral-500)">
                    <FormattedMessage
                      id="UserGroupsList.Subtitle"
                      defaultMessage="Play on long term or custom competitions"
                    />
                  </Text16>
                </>
              ) : (
                <Title2 color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="UserGroupsList.Private.Title"
                    defaultMessage="Private leagues"
                  />
                </Title2>
              )}
            </Titles>

            <CreateButton
              medium
              onClick={() => openCreateDialog(PrivateLeaguesStep.CREATE)}
              color="blue"
            >
              <Icon icon={faPlus} />
              <FormattedMessage
                id="UserGroupsList.Private.CreateOrJoin"
                defaultMessage="Create or join"
              />
            </CreateButton>
          </UserGroupHeader>

          <FlexColContainer>
            <div>
              {enableLongFormatCompetition ? (
                <>
                  <Details>
                    <Title4 color="var(--c-neutral-1000)">
                      <FormattedMessage
                        id="UserGroupsList.Private.subtitle"
                        defaultMessage="Private leagues ({count})"
                        values={{ count: privateUserGroupsTotal }}
                      />
                    </Title4>
                    {privateUserGroupsTotal > 8 && (
                      <Link to={FOOTBALL_PRIVATE_LEAGUES_PRIVATE}>
                        <FormattedMessage
                          id="UserGroupsList.SeeAll"
                          defaultMessage="See all"
                        />
                      </Link>
                    )}
                  </Details>
                  {privateUserGroupsTotal ? (
                    <Groups>
                      {privateUserGroups.map(group => (
                        <PrivateUserGroup group={group} key={group.slug} />
                      ))}
                    </Groups>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openCreateDialog(PrivateLeaguesStep.CREATE)
                      }
                    >
                      <EmptyStateCta />
                    </button>
                  )}
                </>
              ) : (
                <>
                  {paginatedPrivateUserGroupsTotal ? (
                    <>
                      <Groups>
                        {paginatedPrivateUserGroups.map(group => (
                          <PrivateUserGroup group={group} key={group.slug} />
                        ))}
                      </Groups>
                      <InfiniteScrollLoader />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openCreateDialog(PrivateLeaguesStep.CREATE)
                      }
                    >
                      <EmptyStateCta />
                    </button>
                  )}
                </>
              )}
            </div>

            {enableLongFormatCompetition && publicUserGroupsTotal > 0 && (
              <div>
                <Details>
                  <Title4 color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="UserGroupsList.Public.subtitle"
                      defaultMessage="Public leagues ({count})"
                      values={{ count: publicUserGroupsTotal }}
                    />
                  </Title4>
                  {publicUserGroupsTotal > 8 && (
                    <Link to={FOOTBALL_PRIVATE_LEAGUES_PUBLIC}>
                      <FormattedMessage
                        id="UserGroupsList.SeeAll"
                        defaultMessage="See all"
                      />
                    </Link>
                  )}
                </Details>
                <Groups>
                  {[...publicUserGroups]
                    .sort((a, b) => (b.myMembership ? 1 : -1))
                    .map(vicc5UserGroup => (
                      <PublicUserGroup
                        key={vicc5UserGroup.slug}
                        vicc5UserGroup={vicc5UserGroup}
                      />
                    ))}
                </Groups>
              </div>
            )}
          </FlexColContainer>
        </FlexColContainer>
      )}

      {!!joinSecret && (
        <Dialog
          open
          maxWidth={false}
          onClose={() => navigate(FOOTBALL_PRIVATE_LEAGUES, { replace: true })}
          body={<JoinFromLinkDialog joinSecret={joinSecret} />}
        />
      )}
      {showDialog && <PrivateUserGroupDialog />}
    </Root>
  );
};

export default UserGroupsList;
