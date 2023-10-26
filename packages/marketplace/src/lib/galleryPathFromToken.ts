import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { galleryPathFromSport } from '@sorare/core/src/lib/galleryPathFromSport';

export const galleryPathFromToken = (
  slug: string,
  nft: { sport?: Sport } | undefined
) => {
  if (!nft) {
    // FIXME: we don't know where to go without a NFT
    return '#';
  }
  return galleryPathFromSport(slug, nft.sport);
};
