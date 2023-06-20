import { faTrophyAlt } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from '@material-ui/core';
import { parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { LOBBY_TABS, goToLobby } from '@sorare/core/src/constants/routes';
import { CurrentUserQuery_currentUser } from '@sorare/core/src/contexts/currentUser/types';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

type CurrentUserQuery_currentUser_unclaimedSo5Rewards =
  CurrentUserQuery_currentUser['unclaimedSo5Rewards'][number];

interface Props {
  so5FixtureSlug: string;
  rewards: Array<CurrentUserQuery_currentUser_unclaimedSo5Rewards>;
}

const UnclaimedReward = styled(MenuItem)`
  display: flex;
  min-height: 52px;
`;
const UnclaimedIcon = styled(FontAwesomeIcon)`
  margin-left: 5px;
  margin-right: 15px;
`;
const Info = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

export const UnclaimedSo5Rewards = ({ so5FixtureSlug, rewards }: Props) => {
  const { formatDistanceToNow } = useIntlContext();

  const to = goToLobby('past', LOBBY_TABS.MY_TEAMS, so5FixtureSlug);

  return (
    <Link to={to}>
      <UnclaimedReward>
        <UnclaimedIcon icon={faTrophyAlt} />
        <Info>
          <Text16 bold>
            <FormattedMessage
              id="UnclaimedSo5Rewards.newReward"
              defaultMessage="{count, plural, one {# new reward} other {# new rewards}}"
              values={{ count: rewards.length }}
            />
          </Text16>
          <Caption color="var(--c-neutral-600)">
            {formatDistanceToNow(parseISO(rewards[0].so5Fixture.endDate))}
          </Caption>
        </Info>
      </UnclaimedReward>
    </Link>
  );
};

export default UnclaimedSo5Rewards;
