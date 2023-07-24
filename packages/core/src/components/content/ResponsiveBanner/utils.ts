import { FOOTBALL_LOBBY_UPCOMING_CLUB_BANNER } from '@core/constants/routes';

import {
  ConfigQuery_config_responsiveBannerSet_responsiveBanners,
  SlideProps,
} from './types';

export const formatData = ({
  title,
  description,
  id,
  dark,
  backgroundImageUrl,
  mobileBackgroundImageUrl,
  primaryButton,
  primaryButtonLabel,
  secondaryButtonLabel,
  secondaryButton,
  auctionDrop,
}: ConfigQuery_config_responsiveBannerSet_responsiveBanners): SlideProps => {
  const isClubGameBanner =
    primaryButton === FOOTBALL_LOBBY_UPCOMING_CLUB_BANNER;

  let auctionDropFormatted;
  if (auctionDrop) {
    const {
      startDate,
      endDate,
      livePrimaryButtonLabel,
      livePrimaryButtonHref,
      modalText,
      so5TournamentTypes,
    } = auctionDrop;

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    auctionDropFormatted = {
      start,
      end,
      livePrimaryButton:
        livePrimaryButtonLabel && livePrimaryButtonHref
          ? {
              label: livePrimaryButtonLabel,
              url: livePrimaryButtonHref,
            }
          : undefined,
      modalText,
      isEnded: now > end,
      isLive: start < now && now < end,
      so5LeaderboardTypes: so5TournamentTypes.map(
        ({ so5LeaderboardType }) => so5LeaderboardType
      ),
    };
  }

  return {
    id,
    title,
    description,
    dark,
    backgroundImage: backgroundImageUrl,
    mobileBackgroundImage: mobileBackgroundImageUrl,
    primaryButton: {
      label: primaryButtonLabel,
      url: primaryButton,
      openDialog: isClubGameBanner,
    },
    secondaryButton:
      secondaryButton && secondaryButtonLabel
        ? {
            label: secondaryButtonLabel,
            url: secondaryButton,
          }
        : undefined,
    auctionDrop: auctionDropFormatted,
  };
};
