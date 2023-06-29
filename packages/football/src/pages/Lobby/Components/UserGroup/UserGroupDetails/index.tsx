import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  Navigate,
  generatePath,
  useNavigate,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14, Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import {
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';
import { theme } from '@sorare/core/src/style/theme';

import {
  generateUserGroupInvitationWording,
  generateUserGroupInviteLink,
} from '@football/lib/so5';
import Details from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/Details';
import Leaderboard from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/Leaderboard';
import Members from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/Members';
import UserGroupRanking from '@football/pages/Lobby/Components/UserGroup/UserGroupRanking';
import UserGroupPicture from '@football/pages/Lobby/Components/UserGroupPicture';

import { GetUserGroupDetailsQuery } from './__generated__/index.graphql';

type GetUserGroupDetailsQuery_so5_so5UserGroup =
  GetUserGroupDetailsQuery['football']['so5']['so5UserGroup'];

const GET_USERGROUP_DETAILS_QUERY = gql`
  query GetUserGroupDetailsQuery($slug: String!) {
    football {
      so5 {
        so5UserGroup(slug: $slug) {
          id
          slug
          displayName
          description
          joinSecret
          joinDisabled
          logo {
            id
            pictureUrl
            color
          }
          so5TournamentType {
            id
            so5LeaderboardType
            displayName
          }
          ...UserGroupRanking_userGroup
        }
      }
    }
  }
  ${UserGroupRanking.fragments.userGroup}
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  @media ${tabletAndAbove} {
    min-width: 480px;
  }
`;
const DialogBanner = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
`;
const Intro = styled.div`
  display: grid;
  grid-template-areas:
    'avatar leaderboardName'
    'avatar name'
    'avatar ranking';
  grid-template-columns: min-content auto;
  width: 100%;
  align-items: flex-end;
  text-align: left;
  border-radius: var(--triple-unit);
  margin-top: calc(var(--unit) * -1);
  padding: 0 var(--double-unit);
`;
const GroupPicture = styled(UserGroupPicture)`
  grid-area: avatar;
  margin: calc(-1 * var(--double-unit)) var(--double-unit) 0 0;
  border-radius: var(--double-unit);
`;
const Name = styled(Title3)`
  grid-area: name;
`;
const LeaderboardName = styled(Text14)`
  grid-area: leaderboardName;
`;
const Ranking = styled(UserGroupRanking)`
  grid-area: ranking;
  display: flex;
  justify-content: flex-start;
`;
const HeaderButtons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  display: flex;
  gap: var(--unit);
`;
const RouteContainer = styled.div`
  position: relative;
  width: 100%;
  background: var(--c-neutral-200);
  border-radius: var(--double-unit) var(--double-unit) 0 0;
  margin-top: calc(var(--double-and-a-half-unit) * -1);
`;
const Content = styled.div`
  padding: 0 var(--double-unit) var(--double-unit) var(--double-unit);
`;
const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid var(--c-neutral-300);
  margin-bottom: calc(3 * var(--unit));
  padding: 0 var(--double-unit);
  @media ${laptopAndAbove} {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    max-width: ${theme.breakpoints.values.desktop};
    width: 100%;
    margin: 0 auto var(--unit);
  }
`;
const Tabs = styled(StyledSecondaryTabs)`
  width: 100%;
  margin: var(--double-unit) 0;
  padding: 0;
  @media ${laptopAndAbove} {
    padding: 0;
  }
`;
const TooltipContent = styled(Text16)`
  max-width: 200px;
  text-align: center;
`;
const ShareLabel = styled.span`
  display: none;
  @media ${tabletAndAbove} {
    display: inline-block;
    margin-left: var(--unit);
  }
`;

const messages = defineMessages({
  leaderboard: {
    id: 'UserGroupDetails.TabsItem.leaderboard',
    defaultMessage: 'Leaderboard',
  },
  details: {
    id: 'UserGroupDetails.TabsItem.details',
    defaultMessage: 'League details',
  },
  members: {
    id: 'UserGroupDetails.TabsItem.members',
    defaultMessage: 'Members',
  },
});

type TabsContentProps = {
  so5UserGroup: GetUserGroupDetailsQuery_so5_so5UserGroup;
  basePath: string;
};

const TabsContent = ({ so5UserGroup, basePath }: TabsContentProps) => {
  const { tab } = useParams();
  if (tab === PrivateLeaguesTab.LEADERBOARD) {
    return <Leaderboard slug={so5UserGroup.slug} />;
  }
  if (tab === PrivateLeaguesTab.LEAGUE) {
    return <Details slug={so5UserGroup.slug} />;
  }
  if (tab === PrivateLeaguesTab.MEMBERS) {
    return (
      <Members
        slug={so5UserGroup.slug}
        joinDisabled={so5UserGroup.joinDisabled}
        joinSecret={so5UserGroup.joinSecret}
      />
    );
  }
  return (
    <Navigate
      to={generatePath(basePath, {
        slug: so5UserGroup.slug,
        tab: PrivateLeaguesTab.LEADERBOARD,
      })}
    />
  );
};

const UserGroupDetails = () => {
  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const { slug = '' } = useParams();
  const track = useEvents();
  const { formatMessage } = useIntlContext();
  const { data, loading } = useQuery<GetUserGroupDetailsQuery>(
    GET_USERGROUP_DETAILS_QUERY,
    {
      variables: { slug },
    }
  );

  const so5UserGroup = data?.football.so5.so5UserGroup;
  const so5UserGroupId = so5UserGroup?.id || '';
  const pictureUrl = so5UserGroup?.logo?.pictureUrl || '';
  const headerColor = so5UserGroup?.logo?.color || 'var(--c-neutral-300)';
  const displayName = so5UserGroup?.displayName || '';
  const joinSecret = so5UserGroup?.joinSecret || '';

  const basePath = FOOTBALL_PRIVATE_LEAGUES_DETAILS;

  const TabsItems = [
    {
      to: generatePath(basePath, {
        slug,
        tab: PrivateLeaguesTab.LEADERBOARD,
      }),
      label: <span>{formatMessage(messages.leaderboard)}</span>,
    },
    {
      to: generatePath(basePath, {
        slug,
        tab: PrivateLeaguesTab.LEAGUE,
      }),
      label: <span>{formatMessage(messages.details)}</span>,
    },
    {
      to: generatePath(basePath, {
        slug,
        tab: PrivateLeaguesTab.MEMBERS,
      }),
      label: <span>{formatMessage(messages.members)}</span>,
    },
  ];

  const { so5LeaderboardType, displayName: leaderboardDisplayName } =
    so5UserGroup?.so5TournamentType || {};
  const { title, message, values } =
    generateUserGroupInvitationWording(so5LeaderboardType);

  const SocialShareButton = (
    <SocialShare
      url={generateUserGroupInviteLink(joinSecret, currentUser?.slug)}
      title={formatMessage(title)}
      message={formatMessage(message, values)}
      trackingEventName={socialShareEventName.SHARE_USER_GROUP}
      trackingEventContext={socialShareEventContext.USER_GROUP_DETAILS}
      renderButton={({ ShareButton, Icon }) => (
        <ShareButton
          onClick={() => {
            track('Click Share', {
              so5UserGroupId: idFromObject(so5UserGroupId),
            });
          }}
          disabled={so5UserGroup?.joinDisabled}
          medium
        >
          {Icon}
          <ShareLabel>{formatMessage(title)}</ShareLabel>
        </ShareButton>
      )}
    />
  );
  const DisabledSocialShareButton = (
    <Tooltip
      title={
        <TooltipContent>
          <FormattedMessage
            id="UserGroupDetails.Invitations.Disabled"
            defaultMessage="Invitations are currently disabled by administrator."
          />
        </TooltipContent>
      }
    >
      {SocialShareButton}
    </Tooltip>
  );

  const missingUserGroup = formatMessage({
    id: 'UserGroupDetails.GroupNotFound',
    defaultMessage: "This league has been deleted and doesn't exist anymore.",
  });

  return (
    <Dialog
      darkTheme
      open
      errors={{ 404: missingUserGroup }}
      defaultBackUrl={FOOTBALL_PRIVATE_LEAGUES}
      body={({ CloseButton }) => (
        <DialogContent>
          <DialogBanner
            style={{
              backgroundColor:
                headerColor === '#FFFFFF'
                  ? 'var(--c-neutral-400)'
                  : headerColor,
            }}
          />

          {!loading && (
            <HeaderButtons>
              {so5UserGroup?.joinDisabled
                ? DisabledSocialShareButton
                : SocialShareButton}
              <CloseButton onClose={() => navigate(FOOTBALL_PRIVATE_LEAGUES)} />
            </HeaderButtons>
          )}

          <RouteContainer>
            <Intro>
              <GroupPicture
                picture={pictureUrl}
                displayName={displayName}
                size={80}
              />
              <LeaderboardName color="var(--c-neutral-600)" bold>
                {leaderboardDisplayName}
              </LeaderboardName>
              <Name>{displayName}</Name>
              {so5UserGroup && <Ranking group={so5UserGroup} />}
            </Intro>
            <TabsContainer>
              <Tabs items={TabsItems} noBorder replace />
            </TabsContainer>

            <Content>
              {!so5UserGroup ? (
                <LoadingIndicator />
              ) : (
                <TabsContent so5UserGroup={so5UserGroup} basePath={basePath} />
              )}
            </Content>
          </RouteContainer>
        </DialogContent>
      )}
    />
  );
};

export default UserGroupDetails;
