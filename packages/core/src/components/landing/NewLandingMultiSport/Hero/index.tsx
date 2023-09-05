import { defineMessages, useIntl } from 'react-intl';

import { HeroBlock } from '@core/components/landing/HeroBlock';

import heroBackgroundVideo from './assets/heroBackgroundVideo.webm';
import heroVideoPoster from './assets/heroVideoPoster.jpg';
import slideShow_1 from './assets/slideShow_1.jpg';
import slideShow_2 from './assets/slideShow_2.jpg';
import slideShow_3 from './assets/slideShow_3.jpg';
import slideShow_4 from './assets/slideShow_4.jpg';

const messages = defineMessages({
  title: {
    id: 'MultiSport.Landing.Hero.title',
    defaultMessage: 'Fantasy sports.{br}Re-imagined.',
  },
  subtitle: {
    id: 'MultiSport.Landing.Hero.subtitle',
    defaultMessage:
      'Vicc is a next-level fantasy sports game where you collect and compete with ownable digital player cards to win epic prizes. No matter where you finish, you own your cards forever.',
  },
});
export const Hero = () => {
  const { formatMessage } = useIntl();

  return (
    <HeroBlock
      poster={heroVideoPoster}
      videoSrc={heroBackgroundVideo}
      subtitle={formatMessage(messages.subtitle)}
      title={formatMessage(messages.title, { br: <br /> })}
      mobileSlides={[slideShow_1, slideShow_2, slideShow_3, slideShow_4]}
    />
  );
};
