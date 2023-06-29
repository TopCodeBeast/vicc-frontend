import { gql } from '@apollo/client';
import { FC } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { LockedCta } from '@sorare/core/src/components/lobby/LineupActions/LockedCta';
import { FOOTBALL_LOBBY_STARTER_BUNDLES } from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import { getMarketUrl } from '@football/components/unlockCompetition/getMarketUrl';
import { UnlockButtonAction } from '@football/lib/events';

import { UnlockCompetition_so5Leaderboard } from './__generated__/index.graphql';

type Props = {
  so5Leaderboard: UnlockCompetition_so5Leaderboard;
  Cta: FC<{ onClick: () => void }>;
  onClickTracking: (action: UnlockButtonAction) => void;
};

export const UnlockCompetition = ({
  so5Leaderboard,
  Cta,
  onClickTracking,
}: Props) => {
  const navigate = useNavigate();

  const bgLocation = useBgLocation(true);
  const { hasFeaturedStarterPacks } = so5Leaderboard;
  const marketUrl = getMarketUrl(so5Leaderboard);
  const { canCompose } = so5Leaderboard;

  const onUnlockCtaClick = () => {
    if (hasFeaturedStarterPacks) {
      onClickTracking('Open Starter Bundle Dialog');
      navigate(
        generatePath(FOOTBALL_LOBBY_STARTER_BUNDLES, {
          competition: so5Leaderboard.slug,
        }),
        { state: { backgroundState: bgLocation } }
      );
    } else {
      onClickTracking('Redirect to Market');
      navigate(marketUrl);
    }
  };

  return (
    <>
      {canCompose.notEnoughEligibleCards ? (
        <Cta onClick={onUnlockCtaClick} />
      ) : (
        <LockedCta {...canCompose} />
      )}
    </>
  );
};

UnlockCompetition.fragments = {
  so5Leaderboard: gql`
    fragment UnlockCompetition_so5Leaderboard on So5Leaderboard {
      id
      slug
      hasFeaturedStarterPacks
      canCompose {
        value
        reason
        notEnoughEligibleCards
      }
      ...getMarketUrl_so5Leaderboard
    }
    ${getMarketUrl.fragments.so5Leaderboard}
  `,
};
