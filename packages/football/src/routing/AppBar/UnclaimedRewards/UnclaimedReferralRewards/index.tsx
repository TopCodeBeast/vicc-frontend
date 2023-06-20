import { faGift } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { INVITE } from '@sorare/core/src/constants/routes';

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

export const UnclaimedReferralRewards = ({ count }: { count: number }) => {
  return (
    <Link to={INVITE}>
      <UnclaimedReward>
        <UnclaimedIcon icon={faGift} />
        <Info>
          <Text16 bold>
            <FormattedMessage
              id="UnclaimedReferralRewards.newReward"
              defaultMessage="{count, plural, one {# Referral reward} other {# Referral rewards}}"
              values={{ count }}
            />
          </Text16>
        </Info>
      </UnclaimedReward>
    </Link>
  );
};

export default UnclaimedReferralRewards;
