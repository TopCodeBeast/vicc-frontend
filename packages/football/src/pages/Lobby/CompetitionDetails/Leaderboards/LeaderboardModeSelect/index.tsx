import styled from 'styled-components';

import RadioButtons from '@sorare/core/src/atoms/buttons/RadioButtons';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const SwitchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media ${tabletAndAbove} {
    width: auto;
  }
`;

export type LeaderboardModes = 'matchday' | 'overall';

const LeaderboardModeSelect = ({
  leaderboardMode,
  changeLeaderboardMode,
}: {
  leaderboardMode: LeaderboardModes;
  changeLeaderboardMode: (mode: LeaderboardModes) => void;
}) => {
  const { formatMessage } = useIntlContext();

  const PreferredLeaderboardModeOptions = [
    {
      value: 'matchday' as const,
      label: formatMessage({
        id: 'CompetitionDetailsLeaderboardsTab.matchdayLeaderboard',
        defaultMessage: 'Matchday',
      }),
    },
    {
      value: 'overall' as const,
      label: formatMessage({
        id: 'CompetitionDetailsLeaderboardsTab.overallLeaderboard',
        defaultMessage: 'Overall',
      }),
    },
  ];

  return (
    <SwitchWrapper>
      <RadioButtons
        options={PreferredLeaderboardModeOptions}
        value={leaderboardMode}
        handleChange={changeLeaderboardMode}
      />
    </SwitchWrapper>
  );
};

export default LeaderboardModeSelect;
