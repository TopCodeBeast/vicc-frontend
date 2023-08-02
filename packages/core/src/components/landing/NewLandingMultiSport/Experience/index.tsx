import { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { ExperienceBlock } from '@core/components/landing/ExperienceBlock';
import useEvents from '@core/lib/events/useEvents';

import { MarketPlaceDialog } from './MarketPlaceDialog';
import competeImage from './assets/competeImage.jpg';
import competeImageMobile from './assets/competeImageMobile.jpg';
import createImage from './assets/createImage.jpg';
import strengthenImage from './assets/strengthenImage.jpg';
import strengthenVideo from './assets/strengthenVideo.webm';
import winRewardsImage from './assets/winRewardsImage.jpg';

export const messages = defineMessages({
  title: {
    id: 'Landing.Experience.title',
    defaultMessage: 'Experience fantasy sports like a professional owner',
  },
  createTitle: {
    id: 'Landing.Experience.createTitle',
    defaultMessage: 'Build Your Dream Team',
  },
  createText: {
    id: 'Landing.Experience.createText',
    defaultMessage:
      "Create your fantasy roster by scouting and collecting digital player cards. Set your starting lineup and play in twice-weekly competitions for prizes based on your players' real-life performance.{br}{br}Sorare's skill-based game rewards your sports knowledge and lineup strategy.",
  },
  strengthenTitle: {
    id: 'Landing.Experience.strengthenTitle',
    defaultMessage: 'Strengthen Your Squad',
  },
  strengthenText: {
    id: 'Landing.Experience.strengthenText',
    defaultMessage:
      "Buy, sell, and trade digital player cards on Sorare's live Marketplace - which features thousands of players - week over week and season over season. Improve your lineups by adding top performers for an immediate roster boost, or next-generation stars for long-term production.",
  },
  strengthenCTA: {
    id: 'Landing.Experience.strengthenCTA',
    defaultMessage: 'Scout the Marketplace',
  },
  competeTitle: {
    id: 'Landing.Experience.competeTitle',
    defaultMessage: 'Compete and advance',
  },
  competeText: {
    id: 'Landing.Experience.competeText',
    defaultMessage:
      "Learn the game in our beginner competitions and level up. As you progress and climb leaderboards, you'll collect higher-level player cards to compete in advanced contests with bigger prizes. Sorare competitions are free to play.",
  },
  winRewardsTitle: {
    id: 'Landing.Experience.winRewardsTitle',
    defaultMessage: 'Win amazing rewards',
  },
  winRewardsText: {
    id: 'Landing.Experience.winRewardsText',
    defaultMessage:
      'Compete for prizes such as ETH, Sorare player cards, game tickets, gear, apparel, and access to players and VIP experiences.{br}{br}Winners of top competitions receive once-in-a-lifetime rewards.',
  },
});

export const Experience = () => {
  const track = useEvents();
  const { formatMessage } = useIntl();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <ExperienceBlock
        title={formatMessage(messages.title)}
        blocks={[
          {
            title: formatMessage(messages.createTitle),
            text: formatMessage(messages.createText, { br: <br /> }),
            imageSrc: { default: createImage },
          },
          {
            title: formatMessage(messages.strengthenTitle),
            text: formatMessage(messages.strengthenText),
            cta: formatMessage(messages.strengthenCTA),
            ctaAction: () => {
              track('Click Scout the Marketplace');
              setOpenDialog(true);
            },
            imageSrc: { default: strengthenImage },
            videoSrc: strengthenVideo,
          },
          {
            title: formatMessage(messages.competeTitle),
            text: formatMessage(messages.competeText),
            imageSrc: { default: competeImage, mobile: competeImageMobile },
          },
          {
            title: formatMessage(messages.winRewardsTitle),
            text: formatMessage(messages.winRewardsText, { br: <br /> }),
            imageSrc: {
              default: winRewardsImage,
            },
          },
        ]}
      />
      <MarketPlaceDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
};
