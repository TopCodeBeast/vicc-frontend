import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import {
  desktopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

const LeaderboardHeader = styled.div`
  display: grid;
  grid-template-columns: 58px 9fr 2fr 3fr;
  width: 100%;
  text-align: center;
  padding: var(--unit);
  @media ${tabletAndAbove} {
    grid-template-columns: 58px 10fr 1fr 1fr;
  }
  @media ${desktopAndAbove} {
    grid-template-columns: 58px 15fr 1fr 1fr;
  }
`;
const HeaderLabel = styled(Caption)`
  text-transform: uppercase;
  color: var(--c-neutral-600);
`;
const Manager = styled(HeaderLabel)`
  text-align: left;
`;
const UserGroupLeaderboardHeader = () => {
  return (
    <LeaderboardHeader>
      <HeaderLabel>
        <strong>#</strong>
      </HeaderLabel>
      <Manager>
        <strong>
          <FormattedMessage
            id="UserGroupLeaderboardPaginated.Header.Manager"
            defaultMessage="Manager"
          />
        </strong>
      </Manager>
      <HeaderLabel>
        <strong>
          <FormattedMessage
            id="UserGroupLeaderboardPaginated.Header.Gw"
            defaultMessage="MD"
          />
        </strong>
      </HeaderLabel>
      <HeaderLabel>
        <strong>
          <FormattedMessage
            id="UserGroupLeaderboardPaginated.Header.Tot"
            defaultMessage="OVR"
          />
        </strong>
      </HeaderLabel>
    </LeaderboardHeader>
  );
};

export default UserGroupLeaderboardHeader;
