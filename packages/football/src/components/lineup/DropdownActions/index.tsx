import { gql } from '@apollo/client';
import {
  faCheck,
  faEllipsis,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import SmartDropdown, {
  Item,
  ItemText,
} from '@sorare/core/src/atoms/dropdowns/SmartDropdown';
import { Share } from '@sorare/core/src/atoms/icons/Share';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { glossary } from '@sorare/core/src/lib/glossary';

import { useLineupSharingAttributes } from '@sorare/football/src/components/lineup/useLineupSharingAttributes';
import useConfirmLineups from 'hooks/so5/useConfirmLineups';
import useDeleteLineup from 'hooks/so5/useDeleteLineup';
import getLineupActions from 'lib/lineup/getLineupActions';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { LeaderboardAction } from 'types/leaderboard';

import {
  DropdownActions_so5Leaderboard,
  DropdownActions_so5Lineup,
} from './__generated__/index.graphql';

const DeleteItem = styled(Item)`
  & ${ItemText}, & svg {
    color: var(--c-static-red-300);
  }
`;

type Props = {
  so5Lineup: DropdownActions_so5Lineup | null | undefined;
  so5Leaderboard: DropdownActions_so5Leaderboard;
  onActionSuccess?: () => void;
};
const DropdownActions = ({
  so5Lineup,
  so5Leaderboard,
  onActionSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const confirmLineup = useConfirmLineups();
  const deleteLineup = useDeleteLineup();
  const lineupSharingAttributes = useLineupSharingAttributes(so5Lineup);

  const { availableActions } = getLineupActions(so5Lineup, so5Leaderboard);

  const onConfirm = async () => {
    if (!so5Lineup) {
      return;
    }
    setLoading(true);
    await confirmLineup([so5Lineup.id]);
    setLoading(false);
    onActionSuccess?.();
  };

  const onDelete = async () => {
    if (!so5Lineup) {
      return;
    }
    setLoading(true);
    await deleteLineup(so5Lineup.id);
    setLoading(false);
    onActionSuccess?.();
  };

  return (
    <SmartDropdown
      align="right"
      gap={4}
      label={
        <IconButton disableDebounce color="white" icon={faEllipsis} small />
      }
    >
      {so5Lineup?.socialPictureUrls &&
        (({ closeDropdown }) => (
          <SocialShare
            key="social-share"
            image={so5Lineup.socialPictureUrls}
            trackingEventName={socialShareEventName.SHARE_LINEUP}
            trackingEventContext={socialShareEventContext.LEADERBOARD}
            renderButton={({ onClick, Icon }) =>
              closeDropdown ? (
                <Item
                  type="button"
                  onClick={() => {
                    onClick();
                    closeDropdown?.();
                  }}
                  disabled={loading}
                >
                  <ItemText>
                    <FormattedMessage {...glossary.share} />
                  </ItemText>
                  {Icon}
                </Item>
              ) : (
                <IconButton
                  disableDebounce
                  color="white"
                  small
                  onClick={onClick}
                >
                  <Share />
                </IconButton>
              )
            }
            {...lineupSharingAttributes}
          />
        ))}
      {availableActions.includes(LeaderboardAction.Confirm) &&
        (({ closeDropdown }) => (
          <Item
            key="confirm"
            onClick={() => {
              onConfirm();
              closeDropdown?.();
            }}
            disabled={loading}
            type="button"
          >
            <ItemText>
              <FormattedMessage {...glossary.confirm} />
            </ItemText>

            <FontAwesomeIcon icon={faCheck} size="sm" />
          </Item>
        ))}
      {availableActions.includes(LeaderboardAction.Delete) &&
        (({ closeDropdown }) => (
          <DeleteItem
            key="delete"
            onClick={() => {
              onDelete();
              closeDropdown?.();
            }}
            disabled={loading}
            type="button"
          >
            <ItemText>
              <FormattedMessage {...glossary.delete} />
            </ItemText>
            <FontAwesomeIcon icon={faTrashAlt} size="sm" />
          </DeleteItem>
        ))}
    </SmartDropdown>
  );
};

DropdownActions.fragments = {
  so5Lineup: gql`
    fragment DropdownActions_so5Lineup on So5Lineup {
      id
      socialPictureUrls {
        post
      }
      ...getLineupActions_so5Lineup
      ...SocialShare_SocialPictures
      ...useLineupSharingAttributes_so5Lineup
    }
    ${getLineupActions.fragments.so5Lineup}
    ${SocialShare.fragments.socialPictures}
    ${useLineupSharingAttributes.fragments.so5Lineup}
  `,
  so5Leaderboard: gql`
    fragment DropdownActions_so5Leaderboard on So5Leaderboard {
      slug
      ...getLineupActions_so5Leaderboard
    }
    ${getLineupActions.fragments.so5Leaderboard}
  `,
};

export default DropdownActions;
