import { useMemo } from 'react';

import { EnabledWallet } from '@sorare/core/src/__generated__/globalTypes';
// import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

interface Props {
  playerSlug?: string;
  teamSlug?: string;
  primary?: boolean;
  secondary?: boolean;
  starterPacks?: boolean;
  rarity?: string;
  countrySlug?: string;
  userId?: string;
  leagueSlug?: string;
  bundled?: boolean;
  onlySettlableCards?: boolean;
}

const useDefaultFilters = ({
  playerSlug,
  teamSlug,
  primary,
  secondary,
  starterPacks,
  rarity,
  countrySlug,
  userId,
  leagueSlug,
  bundled,
  onlySettlableCards,
}: Props): string[] => {
  const currentUser: any = undefined;// const { currentUser } = useCurrentUserContext(); //TODO****
  const {
    flags: { useNewWallet = false },
  } = useFeatureFlags();

  const settlableWalletsFilter = useMemo(() => {
    const enabledWallets = currentUser?.profile?.enabledWallets;
    if (enabledWallets) {
      if (enabledWallets.length === 1) {
        if (enabledWallets[0] === EnabledWallet.FIAT) {
          // if the user only configured their FIAT wallet, only display them cards they can settle in FIAT
          return 'sale.settlement_wallets:fiat';
        }
        if (enabledWallets[0] === EnabledWallet.ETH) {
          // if the user only configured their ETH wallet, still show them FIAT-only cards,
          // they might want to pay with by CC
        }
      }
    }

    // no filter means all cards
    return null;
  }, [currentUser?.profile?.enabledWallets]);

  const filters = useMemo(
    () =>
      [
        playerSlug && `player.slug:${playerSlug}`,
        teamSlug && `team.slug:${teamSlug}`,
        primary && ['sale.primary:true', 'sale.type:EnglishAuction'],
        starterPacks && ['sale.primary:true', 'sale.type:PrimaryOffer'],
        secondary && 'sale.primary:false',
        onlySettlableCards && useNewWallet && settlableWalletsFilter,
        rarity && `rarity:${rarity}`,
        countrySlug && `country.code:${countrySlug}`,
        userId && `user.id:${userId}`,
        leagueSlug && `active_league.slug:${leagueSlug}`,
        bundled !== undefined && `sale.bundled:${bundled}`,
      ]
        .flat()
        .filter(Boolean),
    [
      playerSlug,
      teamSlug,
      primary,
      starterPacks,
      secondary,
      onlySettlableCards,
      useNewWallet,
      settlableWalletsFilter,
      rarity,
      countrySlug,
      userId,
      leagueSlug,
      bundled,
    ]
  );

  return filters;
};

export default useDefaultFilters;
