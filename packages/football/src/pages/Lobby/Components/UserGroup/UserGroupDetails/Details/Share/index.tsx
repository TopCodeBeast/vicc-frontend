import styled from 'styled-components';

import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import ShareUserGroupWithCode from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/Steps/Congrats/ShareUserGroupWithCode';
import ShareUserGroupWithLink from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/Steps/Congrats/ShareUserGroupWithLink';

const FlexContainerWithGap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  @media ${laptopAndAbove} {
    flex-direction: row;
    & > div {
      width: 50%;
    }
  }
`;

type Props = {
  joinSecret: string;
  so5UserGroupId: string;
  so5LeaderboardType?: string;
};
const Share = ({ joinSecret, so5UserGroupId, so5LeaderboardType }: Props) => {
  if (!joinSecret) {
    return null;
  }

  return (
    <FlexContainerWithGap>
      <ShareUserGroupWithLink
        joinSecret={joinSecret}
        so5UserGroupId={so5UserGroupId}
        so5LeaderboardType={so5LeaderboardType}
      />
      <ShareUserGroupWithCode
        joinSecret={joinSecret}
        so5UserGroupId={so5UserGroupId}
      />
    </FlexContainerWithGap>
  );
};

export default Share;
