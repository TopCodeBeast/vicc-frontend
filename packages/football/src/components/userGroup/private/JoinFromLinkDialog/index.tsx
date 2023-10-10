import { FormattedMessage } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATED,
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesStep,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import useReferrer from '@sorare/core/src/contexts/queryString/useReferrer';
import { STORAGE } from '@sorare/core/src/hooks/useLocalStorage';
import { glossary } from '@sorare/core/src/lib/glossary';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import useJoinPrivateUserGroup from '@football/components/userGroup/private/Dialog/CreateOrJoin/useJoinPrivateUserGroup';
import PrivateUserGroupPreview from '@football/components/userGroup/private/Dialog/Steps/Congrats/PrivateUserGroupPreview';
import useGetPrivateUserGroupByJoinSecret from '@football/components/userGroup/private/useGetPrivateUserGroupByJoinSecret';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  text-align: center;
  padding: 0 var(--triple-unit) var(--triple-unit) var(--triple-unit);
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;
const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--double-unit);
`;
const Subtitle = styled(Text16)`
  color: var(--c-neutral-600);
`;
const JoinButton = styled(Button)`
  margin-top: var(--triple-unit);
`;
const ButtonTextWrapper = styled.div`
  padding: 0 var(--double-unit);
`;

enum joinStates {
  default,
  alreadyJoined,
  disabled,
}
export type Props = { joinSecret: string };
const PrivateUserGroupJoinFromLinkDialog = ({ joinSecret }: Props) => {
  const navigate = useNavigate();
  const joinPrivateUserGroup = useJoinPrivateUserGroup();
  const { data } = useGetPrivateUserGroupByJoinSecret(joinSecret);
  const { referrer } = useReferrer();

  if (localStorage.getItem(STORAGE.inviteCode)) {
    localStorage.removeItem(STORAGE.inviteCode);
  }

  if (!(data?.vicc5Root.vicc5UserGroup && joinSecret)) {
    return null;
  }

  const {
    slug,
    logo,
    displayName,
    administrator,
    joinDisabled,
    membershipsCount,
    myMembership,
  } = data?.vicc5Root.vicc5UserGroup;
  const alreadyJoined = !!myMembership;

  const getPrivateUserGroupJoinState = () => {
    if (joinDisabled) {
      return joinStates.disabled;
    }
    if (alreadyJoined) {
      return joinStates.alreadyJoined;
    }
    return joinStates.default;
  };
  const PrivateUserGroupJoinState = getPrivateUserGroupJoinState();

  const navigateToDetails = () => {
    navigate(
      generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
        slug,
        tab: PrivateLeaguesTab.LEAGUE,
      }),
      { replace: true }
    );
  };

  const onJoin = async () => {
    const { data: joinData } = await joinPrivateUserGroup({ joinSecret });
    const vicc5UserGroup = joinData?.joinVicc5UserGroup?.vicc5UserGroup;
    if (vicc5UserGroup) {
      navigate(
        generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATED, {
          slug: vicc5UserGroup?.slug,
          step: PrivateLeaguesStep.CONGRATS,
        }),
        { replace: true }
      );
    }
  };

  const renderData = {
    [joinStates.disabled]: {
      onClick: () => navigate(FOOTBALL_PRIVATE_LEAGUES, { replace: true }),
      title: (
        <FormattedMessage
          id="JoinFromLinkDialog.Disabled.Title"
          defaultMessage="It is not possible to join this league"
        />
      ),
      subtitle: (
        <FormattedMessage
          id="JoinFromLinkDialog.Disabled.Subtitle"
          defaultMessage="Invitations are currently disabled by administrator"
        />
      ),
      buttonText: <FormattedMessage {...glossary.close} />,
      buttonColor: 'darkGray',
    },
    [joinStates.alreadyJoined]: {
      onClick: navigateToDetails,
      title: (
        <FormattedMessage
          id="JoinFromLinkDialog.AlreadyJoined.Title"
          defaultMessage="{admin}'s league"
          values={{ admin: administrator?.nickname }}
        />
      ),
      subtitle: (
        <FormattedMessage
          id="JoinFromLinkDialog.AlreadyJoined.Subtitle"
          defaultMessage="You already joined this league"
        />
      ),
      buttonText: (
        <FormattedMessage
          id="JoinFromLinkDialog.AlreadyJoined.Button"
          defaultMessage="View League Details"
        />
      ),
      buttonColor: 'blue',
    },
    [joinStates.default]: {
      onClick: () => {
        onJoin();
      },
      title: referrer ? (
        <FormattedMessage
          id="JoinFromLinkDialog.Default.TitleWithReferrer"
          defaultMessage="Join {referrer}'s league?"
          values={{ referrer }}
        />
      ) : (
        <FormattedMessage
          id="JoinFromLinkDialog.Default.Title"
          defaultMessage="Join your friend's league?"
        />
      ),
      subtitle: (
        <FormattedMessage
          id="JoinFromLinkDialog.Default.Subtitle"
          defaultMessage="You’ve been invited to join league {displayName}"
          values={{ displayName }}
        />
      ),
      buttonText: (
        <FormattedMessage
          id="JoinFromLinkDialog.Default.Button"
          defaultMessage="Join"
        />
      ),
      buttonColor: 'blue',
    },
  } as const;

  return (
    <DialogContainer>
      <PrivateUserGroupPreview
        logo={logo}
        displayName={displayName}
        memberCount={membershipsCount}
      />
      <DialogContent>
        <Title3>{renderData[PrivateUserGroupJoinState].title}</Title3>
        <Subtitle>{renderData[PrivateUserGroupJoinState].subtitle}</Subtitle>

        <JoinButton
          onClick={renderData[PrivateUserGroupJoinState].onClick}
          medium
          color={renderData[PrivateUserGroupJoinState].buttonColor}
        >
          <ButtonTextWrapper>
            {renderData[PrivateUserGroupJoinState].buttonText}
          </ButtonTextWrapper>
        </JoinButton>
      </DialogContent>
    </DialogContainer>
  );
};

export default PrivateUserGroupJoinFromLinkDialog;
