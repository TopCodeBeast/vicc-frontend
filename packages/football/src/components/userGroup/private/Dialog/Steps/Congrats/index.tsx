import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link, generatePath, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Confetti from '@sorare/core/src/atoms/animations/Confetti';
import { Button } from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import {
  FOOTBALL_HOME,
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useLifecycle, { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';

import { fragments } from '@football/components/userGroup/private/Dialog/fragments';
import {
  generatePrivateUserGroupInvitationWording,
  generatePrivateUserGroupInviteLink,
} from '@football/lib/so5';

import UserGroupPreview from './PrivateUserGroupPreview';
import {
  GetPrivateUserGroupQuery,
  GetPrivateUserGroupQueryVariables,
} from './__generated__/index.graphql';

export const GET_PRIVATE_USER_GROUP_QUERY = gql`
  query GetPrivateUserGroupQuery($slug: String!) {
    football {
      vicc5 {
        vicc5UserGroup(slug: $slug) {
          slug
          membershipsCount
          ...vicc5UserGroup
          myMembership {
            id
            administrator
          }
          vicc5TournamentType {
            id
            vicc5LeaderboardType
          }
        }
      }
    }
  }
  ${fragments.vicc5UserGroup}
` as TypedDocumentNode<
  GetPrivateUserGroupQuery,
  GetPrivateUserGroupQueryVariables
>;

const DialogContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  text-align: center;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  gap: var(--double-unit);
  align-items: center;
`;
const CongratsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--double-unit) var(--double-unit) 0 var(--double-unit);
`;
const Subtitle = styled(Text16)`
  color: var(--c-neutral-600);
`;
const ConfettiWrapper = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const messages = defineMessages({
  title: {
    id: 'UserGroupDialog.Congratulations.Title',
    defaultMessage: 'Congratulations',
  },
  createdSubtitle: {
    id: 'UserGroupDialog.Congratulations.Created.Subtitle',
    defaultMessage: "You've created a new league",
  },
  joinedSubtitle: {
    id: 'UserGroupDialog.Congratulations.Joined.Subtitle',
    defaultMessage: "You've joined {displayName} league",
  },
  visitTheLeague: {
    id: 'UserGroupDialog.Congratulations.Visit.Cta',
    defaultMessage: 'Visit the league',
  },
  viewDashboard: {
    id: 'UserGroupDialog.Congratulations.ViewDashboard',
    defaultMessage: 'View dashboard',
  },
});

type Props = {
  slug?: string;
  redirectToManagerHome?: boolean;
};
export const Congrats = ({ slug, redirectToManagerHome }: Props) => {
  const { formatMessage } = useIntlContext();
  const params = useParams();
  const userGroupSlug = slug || params.slug;
  const { update: saveStep } = useLifecycle();
  const { currentUser } = useCurrentUserContext();

  const { data } = useQuery(GET_PRIVATE_USER_GROUP_QUERY, {
    variables: {
      // FIXME undefined case is improperly handled
      slug: userGroupSlug ?? '',
    },
  });

  useEffect(() => {
    saveStep(LIFECYCLE.sawComposeTeamCongrats, true);
  }, [saveStep]);
  if (!data) {
    return null;
  }
  const {
    football: {
      vicc5: { vicc5UserGroup },
    },
  } = data;

  const {
    displayName,
    logo,
    myMembership,
    membershipsCount,
    joinSecret,
    vicc5TournamentType: { vicc5LeaderboardType },
  } = vicc5UserGroup;
  const isCreation = myMembership?.administrator && membershipsCount === 1;

  const { title, message, values } =
    generatePrivateUserGroupInvitationWording(vicc5LeaderboardType);
  return (
    <DialogContent>
      <Content>
        <UserGroupPreview
          logo={logo}
          displayName={displayName}
          memberCount={membershipsCount}
        />
        <CongratsContent>
          <Title3>
            <FormattedMessage {...messages.title} />
          </Title3>
          {isCreation ? (
            <Subtitle>
              <FormattedMessage {...messages.createdSubtitle} />
            </Subtitle>
          ) : (
            <Subtitle>
              <FormattedMessage
                {...messages.joinedSubtitle}
                values={{ displayName }}
              />
            </Subtitle>
          )}
        </CongratsContent>
        {redirectToManagerHome ? (
          <Button component={Link} to={FOOTBALL_HOME} color="blue" medium>
            <FormattedMessage {...messages.viewDashboard} />
          </Button>
        ) : (
          <>
            <SocialShare
              url={generatePrivateUserGroupInviteLink(
                joinSecret,
                currentUser?.slug,
                vicc5LeaderboardType
              )}
              title={formatMessage(title)}
              message={formatMessage(message, values)}
              trackingEventName={socialShareEventName.SHARE_USER_GROUP}
              trackingEventContext={socialShareEventContext.USER_GROUP_CONGRATS}
              renderButton={({ ShareButton, Icon }) => (
                <ShareButton color="blue" medium startIcon={Icon}>
                  <FormattedMessage {...title} />
                </ShareButton>
              )}
            />
            <Button
              component={Link}
              to={generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
                slug: userGroupSlug,
                tab: PrivateLeaguesTab.LEAGUE,
              })}
              color="darkGray"
              medium
            >
              <FormattedMessage {...messages.visitTheLeague} />
            </Button>
          </>
        )}

        <ConfettiWrapper>
          <Confetti />
        </ConfettiWrapper>
      </Content>
    </DialogContent>
  );
};

export default Congrats;
