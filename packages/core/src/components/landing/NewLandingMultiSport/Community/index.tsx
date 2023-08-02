import { CommunityBlock } from '@core/components/landing/CommunityBlock';
import { FootballPastWinner } from '@core/components/landing/CommunityBlock/FootballPastWinner';

export const Community = () => {
  return (
    <CommunityBlock>
      <FootballPastWinner leaderboardSlug="global-cap-division" />
    </CommunityBlock>
  );
};
