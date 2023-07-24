import { ConfigQuery } from "@sorare/core/src/contexts/config/__generated__/Provider.graphql";

export type ConfigQuery_config_responsiveBannerSet_responsiveBanners = ConfigQuery['config']['responsiveBannerSet'][0]['responsiveBanners'][0];

export type SlideProps = {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  mobileBackgroundImage: string;
  dark?: boolean | null;
  auctionDrop?: {
    start: Date;
    end: Date;
    isEnded: boolean;
    isLive: boolean;
    modalText: string;
    livePrimaryButton: any;
    so5LeaderboardTypes: any[];
  };
  primaryButton: {
    label: string;
    url: string;
    openDialog?: boolean;
  };
  secondaryButton?: {
    label: string;
    url: string;
  };
};

export type Props = {
  slides: SlideProps[];
  analyticsParams: any;
  isComposeTeam: boolean;
};
