import classNames from 'classnames';
import { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Button } from '@core/atoms/buttons/Button';
import { Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import useEvents from '@core/lib/events/useEvents';
import { theme } from '@core/style/theme';

import { MarketPlaceDialog } from './MarketPlaceDialog';
import competeImage from './assets/competeImage.jpg';
import competeImageMobile from './assets/competeImageMobile.jpg';
import createImage from './assets/createImage.jpg';
import strengthenImage from './assets/strengthenImage.jpg';
import strengthenVideo from './assets/strengthenVideo.webm';
import winRewardsImage from './assets/winRewardsImage.jpg';

const messages = defineMessages({
  title: {
    id: 'Landing.Experience.title',
    defaultMessage: 'Experience fantasy sports like a professional owner',
  },
  createTitle: {
    id: 'Landing.Experience.createTitle',
    defaultMessage: 'Create your dream team',
  },
  createText: {
    id: 'Landing.Experience.createText',
    defaultMessage:
      "Collect, buy, sell, and trade digital player cards to build your squad and compete for prizes based on your players' real-life performance. Sorare's skill-based game rewards your sports knowledge and lineup strategy.",
  },
  strengthenTitle: {
    id: 'Landing.Experience.strengthenTitle',
    defaultMessage: 'Strengthen Your Squad',
  },
  strengthenText: {
    id: 'Landing.Experience.strengthenText',
    defaultMessage:
      "Scout players and use Sorare's Marketplace to buy, sell, or trade for their digital cards. Keep improving your team, week over week and season over season.",
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
      "Learn the game in our beginner competitions and level up. As you progress and climb leaderboards, you'll collect higher-level player cards to compete in advanced contests with bigger prizes. All competitions are free to play.",
  },
  winRewardsTitle: {
    id: 'Landing.Experience.winRewardsTitle',
    defaultMessage: 'Win amazing rewards',
  },
  winRewardsText: {
    id: 'Landing.Experience.winRewardsText',
    defaultMessage:
      "Finish at the top of Sorare leaderboards and you'll win prizes such as ETH, match tickets, merchandise, and access to players and VIP experiences.{br}{br}Winners of top competitions receive once-in-a-lifetime rewards.",
  },
});

const Wrapper = styled(ContentContainer)`
  margin-top: calc(var(--unit) * 5);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    margin-top: calc(var(--unit) * 14);
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-family: 'Druk Wide';
  text-transform: uppercase;
  text-align: center;
  line-height: 1;
  margin-bottom: calc(var(--unit) * 7);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 40px;
    margin-bottom: calc(var(--unit) * 14);
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 56px;
  }
`;

const BlockList = styled.div`
  display: grid;
  gap: calc(var(--unit) * 7);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    gap: calc(var(--unit) * 10);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    gap: 0;
  }
`;

const BlockWrapper = styled.div`
  display: grid;
  border: 1px solid var(--c-static-neutral-800);

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-template-columns: 1fr 3fr;
    grid-template-areas: 'text image';
    gap: calc(var(--unit) * 5);
    padding: calc(var(--unit) * 5);
    &.reverse {
      grid-template-columns: 3fr 1fr;
      grid-template-areas: ' image text';
    }
  }
`;

const BlockContent = styled.div`
  padding: var(--triple-unit) var(--double-and-a-half-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: grid;
    gap: calc(var(--unit) * 5);
    grid-template-columns: 1fr 2fr;
    row-gap: var(--double-and-a-half-unit);
    padding: var(--quadruple-unit) var(--double-and-a-half-unit);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: flex;
    grid-area: text;
    gap: var(--double-unit);
    flex-direction: column;
    text-align: left;
    padding: 0;
  }
`;

const BlockNumber = styled(Text18)`
  display: flex;
  font-size: 16px;
  line-height: 1.5;
  align-items: center;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 18px;
  }
`;

const Line = styled.span`
  flex-grow: 1;
  height: 1px;
  background: var(--c-neutral-100);
  margin-left: 16px;
`;

const BlockTitle = styled.h3`
  font-size: 20px;
  line-height: 1;
  font-family: 'Druk Wide';
  text-transform: uppercase;
  margin-top: var(--double-and-a-half-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 24px;
    margin-top: var(--unit);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    margin-top: var(--double-unit);
  }
`;

const BlockText = styled(Text18)`
  font-size: 16px;
  line-height: 1.5;
  margin-top: var(--unit);

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 18px;
  }
`;

const Picture = styled.picture`
  grid-row: 1;
  position: relative;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-row: auto;
    grid-area: image;
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  align-self: center;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    aspect-ratio: 1.7;
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-row: auto;
    border-radius: var(--double-unit);
  }
`;

const Video = styled.video`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  align-self: center;
  grid-row: 1;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    aspect-ratio: initial;
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-row: auto;
    grid-area: image;
    border-radius: var(--double-unit);
  }
`;

const CTA = styled.div`
  margin-top: var(--double-unit);
`;

export const ExperienceBlock = () => {
  const track = useEvents();
  const { formatMessage } = useIntl();
  const [openDialog, setOpenDialog] = useState(false);

  const blocks = [
    {
      title: messages.createTitle,
      text: messages.createText,
      imageSrc: { default: createImage },
    },
    {
      title: messages.strengthenTitle,
      text: messages.strengthenText,
      cta: messages.strengthenCTA,
      ctaAction: () => {
        track('Click Scout the Marketplace');
        setOpenDialog(true);
      },
      imageSrc: { default: strengthenImage },
      videoSrc: strengthenVideo,
    },
    {
      title: messages.competeTitle,
      text: messages.competeText,
      imageSrc: { default: competeImage, mobile: competeImageMobile },
    },
    {
      title: messages.winRewardsTitle,
      text: messages.winRewardsText,
      imageSrc: {
        default: winRewardsImage,
      },
    },
  ];

  return (
    <Wrapper>
      <Title>{formatMessage(messages.title)}</Title>
      <BlockList>
        {blocks.map((block, index) => (
          <BlockWrapper
            key={block.title.id}
            className={classNames({ reverse: index % 2 })}
          >
            <BlockContent>
              <div>
                <BlockNumber
                  color="var(--c-static-neutral-600)"
                  className={classNames({ reverse: index % 2 })}
                >
                  0{index + 1}
                  <Line />
                </BlockNumber>
                <BlockTitle>{formatMessage(block.title)}</BlockTitle>
              </div>
              <BlockText color="var(--c-static-neutral-600)">
                {formatMessage(block.text, { br: <br /> })}
              </BlockText>
              {block.cta && (
                <CTA>
                  <Button color="white" medium onClick={block?.ctaAction}>
                    {formatMessage(block.cta)}
                  </Button>
                </CTA>
              )}
            </BlockContent>
            {block.videoSrc ? (
              <Video
                loop
                muted
                autoPlay
                playsInline
                poster={block.imageSrc.default}
              >
                <source src={block.videoSrc} type="video/webm" />
              </Video>
            ) : (
              <Picture>
                {block.imageSrc.mobile && (
                  <source
                    media={`(max-width: ${theme.breakpoints.values.tablet}px)`}
                    srcSet={block.imageSrc.mobile}
                  />
                )}
                <Image
                  src={block.imageSrc.default}
                  alt={formatMessage(block.title)}
                />
              </Picture>
            )}
          </BlockWrapper>
        ))}
      </BlockList>
      <MarketPlaceDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Wrapper>
  );
};
