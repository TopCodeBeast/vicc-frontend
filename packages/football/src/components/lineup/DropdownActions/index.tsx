import { TypedDocumentNode, gql } from '@apollo/client';
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

import { useLineupSharingAttributes } from '@football/components/lineup/useLineupSharingAttributes';
import useConfirmLineups from '@football/hooks/so5/useConfirmLineups';
import useDeleteLineup from '@football/hooks/so5/useDeleteLineup';
import getLineupActions from '@football/lib/lineup/getLineupActions';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { LeaderboardAction } from '@football/types/leaderboard';

import {
  DropdownActions_vicc5Leaderboard,
  DropdownActions_vicc5Lineup,
} from './__generated__/index.graphql';

const DeleteItem = styled(Item)`
  & ${ItemText}, & svg {
    color: var(--c-static-red-300);
  }
`;

type Props = {
  vicc5Lineup: DropdownActions_vicc5Lineup | null | undefined;
  vicc5Leaderboard: DropdownActions_vicc5Leaderboard;
  onActionSuccess?: () => void;
};
const DropdownActions = ({
  vicc5Lineup,
  vicc5Leaderboard,
  onActionSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const confirmLineup = useConfirmLineups();
  const deleteLineup = useDeleteLineup();
  const lineupSharingAttributes = useLineupSharingAttributes(vicc5Lineup);

  const { availableActions } = getLineupActions(vicc5Lineup, vicc5Leaderboard);

  const onConfirm = async () => {
    if (!vicc5Lineup) {
      return;
    }
    setLoading(true);
    await confirmLineup([vicc5Lineup.id]);
    setLoading(false);
    onActionSuccess?.();
  };

  const onDelete = async () => {
    if (!vicc5Lineup) {
      return;
    }
    setLoading(true);
    await deleteLineup(vicc5Lineup.id);
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
      {vicc5Lineup?.socialPictureUrls &&
        (({ closeDropdown }) => (
          <SocialShare
            image={vicc5Lineup.socialPictureUrls}
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
  vicc5Lineup: gql`
    fragment DropdownActions_vicc5Lineup on Vicc5Lineup {
      id
      socialPictureUrls {
        post
      }
      ...getLineupActions_vicc5Lineup
      ...SocialShare_SocialPictures
      ...useLineupSharingAttributes_vicc5Lineup
    }
    ${getLineupActions.fragments.vicc5Lineup}
    ${SocialShare.fragments.socialPictures}
    ${useLineupSharingAttributes.fragments.vicc5Lineup}
  ` as TypedDocumentNode<DropdownActions_vicc5Lineup>,
  vicc5Leaderboard: gql`
    fragment DropdownActions_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      ...getLineupActions_vicc5Leaderboard
    }
    ${getLineupActions.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<DropdownActions_vicc5Leaderboard>,
};

export default DropdownActions;
