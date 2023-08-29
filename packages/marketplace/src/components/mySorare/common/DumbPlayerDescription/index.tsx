import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import DumbPlayerAvatar from '@sorare/core/src/components/player/DumbPlayerAvatar';
import { LEGACY_PLAYER_SHOW } from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';

interface Props {
  displayName: string;
  avatarImageUrl?: string | null;
  slug: string;
  positions: string[];
  shirtNumber?: number | null;
  activeClubName?: string;
  sport?: Sport;
}

const Root = styled.div`
  display: flex;
`;
const PlayerDescription = styled.div`
  padding-left: 10px;
`;

export const DumbPlayerDescription = (props: Props) => {
  const {
    displayName,
    avatarImageUrl,
    slug,
    positions,
    shirtNumber,
    activeClubName,
    sport,
  } = props;
  const { generateSportPath } = useSportContext();

  return (
    <Root>
      <DumbPlayerAvatar name={displayName} avatarUrl={avatarImageUrl} />
      <PlayerDescription>
        <Link
          to={generateSportPath(LEGACY_PLAYER_SHOW, {
            params: { slug },
            sport,
          })}
        >
          <Text16 bold>{displayName}</Text16>
        </Link>
        <Text16 color="var(--c-neutral-600)">
          {`${positions.join(', ')} #${shirtNumber} | ${activeClubName}`}
        </Text16>
      </PlayerDescription>
    </Root>
  );
};

export default DumbPlayerDescription;
