import {
  faDiscord,
  faFacebook,
  faInstagram,
  faReddit,
  faTiktok,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

import { SocialLinkProps } from '@core/atoms/ui/SocialMedias';
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
} from '@core/constants/externalLinks';

const SocialLinksConfig: SocialLinkProps[] = [
  {
    icon: faTwitter,
    social: 'twitter',
    links: [
      {
        label: '@Vicc',
        link: TWITTER_URL,
      },
      /*{
        label: '@ViccMLB',
        link: MLB_TWITTER_URL,
      },
      {
        label: '@ViccNBA',
        link: NBA_TWITTER_URL,
      },*/
      {
        label: '@ViccSupport',
        link: SUPPORT_TWITTER_URL,
      },
    ],
  },
  {
    icon: faFacebook,
    social: 'facebook',
    links: [
      {
        label: '@Vicc',
        link: FACEBOOK_URL,
      },
      /*{
        label: '@ViccMLB',
        link: MLB_FACEBOOK_URL,
      },
      {
        label: '@ViccNBA',
        link: NBA_FACEBOOK_URL,
      },*/
    ],
  },
  {
    icon: faInstagram,
    social: 'instagram',
    links: [
      {
        label: '@Vicc',
        link: INSTAGRAM_URL,
      },
      /*{
        label: '@ViccMLB',
        link: MLB_INSTAGRAM_URL,
      },
      {
        label: '@ViccNBA',
        link: NBA_INSTAGRAM_URL,
      },*/
    ],
  },
  {
    icon: faDiscord,
    social: 'discord',
    links: [
      {
        label: 'Vicc: Cricket',
        link: DISCORD_INVITATION_URL,
      },
      /*{
        label: 'Vicc: MLB',
        link: MLB_DISCORD_INVITATION_URL,
      },
      {
        label: 'Vicc: NBA',
        link: NBA_DISCORD_INVITATION_URL,
      },*/
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
        label: '@ViccHQ',
        link: YOUTUBE_URL,
      },
    ],
  },
  {
    icon: faTiktok,
    social: 'tiktok',
    links: [
      {
        label: '@Vicc',
        link: TIKTOK_URL,
      },
    ],
  },
];

export default SocialLinksConfig;
