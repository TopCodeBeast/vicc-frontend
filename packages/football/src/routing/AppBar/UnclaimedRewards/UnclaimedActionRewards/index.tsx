import { MenuItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_USER_GALLERY_CARDS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import Airdrop from '@football/components/so5/ActionReward/Airdrop';

const UnclaimedReward = styled(MenuItem)`
  display: flex;
  min-height: 52px;
`;
const UnclaimedActionRewardIcon = styled(Airdrop)`
  width: 26px;
  margin-right: 10px;
`;
const Info = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

export const UnclaimedActionRewards = () => {
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) {
    return null;
  }
  return (
    <Link
      to={generatePath(FOOTBALL_USER_GALLERY_CARDS, { slug: currentUser.slug })}
    >
      <UnclaimedReward>
        <UnclaimedActionRewardIcon />
        <Info>
          <Text16 bold>
            <FormattedMessage
              id="UnclaimedActionRewards.newRewardTitle"
              defaultMessage="Daily reward"
            />
          </Text16>
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage
              id="UnclaimedActionRewards.newRewardSubtitle"
              defaultMessage="Sign a new player"
            />
          </Caption>
        </Info>
      </UnclaimedReward>
    </Link>
  );
};

export default UnclaimedActionRewards;
