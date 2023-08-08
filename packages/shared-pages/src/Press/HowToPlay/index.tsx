import { FormattedMessage } from 'react-intl';

import Bold from '@sorare/core/src/atoms/typography/Bold';
import Poster from '@sorare/core/src/components/marketing/Poster';
import { MarketingText20 } from '@sorare/core/src/components/marketing/typography';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';

export const HowToPlay = () => {
  return (
    <Poster
      pictureUrl={`${FRONTEND_ASSET_HOST}/pages/press/howToPlay.jpg`}
      title={
        <FormattedMessage
          id="press.howToPlay.title"
          defaultMessage="How to <bold>play</bold>{br}the game"
          values={{
            bold: Bold,
            br: <br />,
          }}
        />
      }
      desc={
        <MarketingText20 color="var(--c-neutral-100)">
          <FormattedMessage
            id="press.howToPlay.desc"
            defaultMessage="Video tutorial"
          />
        </MarketingText20>
      }
      videoUrl={{
        src: `${FRONTEND_ASSET_HOST}/videos/sorare_how_to_play.mp4`,
        mobileSrc: `${FRONTEND_ASSET_HOST}/videos/sorare_how_to_play.mp4`,
        preview: `${FRONTEND_ASSET_HOST}/videos/sorare_how_to_play_short.mp4`,
      }}
    />
  );
};
