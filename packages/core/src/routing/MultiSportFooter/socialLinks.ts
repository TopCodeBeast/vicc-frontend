import {
  faDiscord,
  faFacebook,
  faInstagram,
  faReddit,
  faTiktok,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

import { SocialLinkProps } from '@sorare/core/src/atoms/ui/SocialMedias';
import {
  DISCORD_INVITATION_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MLB_DISCORD_INVITATION_URL,
  MLB_FACEBOOK_URL,
  MLB_INSTAGRAM_URL,
  MLB_TWITTER_URL,
  NBA_DISCORD_INVITATION_URL,
  NBA_FACEBOOK_URL,
  NBA_INSTAGRAM_URL,
  NBA_TWITTER_URL,
  REDDIT_URL,
  SUPPORT_TWITTER_URL,
  TIKTOK_URL,
  TWITTER_URL,
  YOUTUBE_URL,
} from '@sorare/core/src/constants/externalLinks';

const SocialLinksConfig: SocialLinkProps[] = [
  {
    icon: faTwitter,
    social: 'twitter',
    links: [
      {
        label: '@Sorare',
        link: TWITTER_URL,
      },
      {
        label: '@SorareMLB',
        link: MLB_TWITTER_URL,
      },
      {
        label: '@SorareNBA',
        link: NBA_TWITTER_URL,
      },
      {
        label: '@SorareSupport',
        link: SUPPORT_TWITTER_URL,
      },
    ],
  },
  {
    icon: faFacebook,
    social: 'facebook',
    links: [
      {
        label: '@Sorare',
        link: FACEBOOK_URL,
      },
      {
        label: '@SorareMLB',
        link: MLB_FACEBOOK_URL,
      },
      {
        label: '@SorareNBA',
        link: NBA_FACEBOOK_URL,
      },
    ],
  },
  {
    icon: faInstagram,
    social: 'instagram',
    links: [
      {
        label: '@Sorare',
        link: INSTAGRAM_URL,
      },
      {
        label: '@SorareMLB',
        link: MLB_INSTAGRAM_URL,
      },
      {
        label: '@SorareNBA',
        link: NBA_INSTAGRAM_URL,
      },
    ],
  },
  {
    icon: faDiscord,
    social: 'discord',
    links: [
      {
        label: 'Sorare: Football',
        link: DISCORD_INVITATION_URL,
      },
      {
        label: 'Sorare: MLB',
        link: MLB_DISCORD_INVITATION_URL,
      },
      {
        label: 'Sorare: NBA',
        link: NBA_DISCORD_INVITATION_URL,
      },
    ],
  },
  {
    icon: faReddit,
    social: 'reddit',
    links: [
      {
        label: 'Reddit',
        link: REDDIT_URL,
      },
    ],
  },
  {
    icon: faYoutube,
    social: 'youtube',
    links: [
      {
        label: '@SorareHQ',
        link: YOUTUBE_URL,
      },
    ],
  },
  {
    icon: faTiktok,
    social: 'tiktok',
    links: [
      {
        label: '@Sorare',
        link: TIKTOK_URL,
      },
    ],
  },
];

export default SocialLinksConfig;
