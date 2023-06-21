import classNames from 'classnames';
import { useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { LinkOther } from '@core/atoms/navigation/Box';
import { Text14, Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import { theme } from '@core/style/theme';
import { hideScrollbar } from '@core/style/utils';

import diamond from './assets/diamond.svg';
import ethImage from './assets/ethImage.jpg';
import julioRodriquez from './assets/julioRodriquez.jpg';
import playIcon from './assets/playIcon.svg';
import sevillaImage from './assets/sevillaImage.jpg';
import travelImage from './assets/travelImage.jpg';

const messages = defineMessages({
  title: {
    id: 'Landing.Prizes.Title',
    defaultMessage: 'Exclusive Access + Epic Prizes',
  },
  subtitle: {
    id: 'Landing.Prizes.Subtitle',
    defaultMessage: 'Fantasy sports. Real ownership. Major rewards.',
  },
  comingSoon: {
    id: 'Landing.Prizes.comingSoon',
    defaultMessage: 'Coming soon',
  },
  watchCTA: {
    id: 'Landing.Prizes.watchCTA',
    defaultMessage: 'Watch now',
  },
  lifetime: {
    id: 'Landing.Prizes.lifetime',
    defaultMessage: 'Once in a lifetime',
  },
  sevilla: {
    id: 'Landing.Prizes.sevilla',
    defaultMessage: 'Sevilla Derby VIP Experience',
  },
  learnCTA: {
    id: 'Landing.Prizes.learnCTA',
    defaultMessage: 'Learn more',
  },
  eth: {
    id: 'Landing.Prizes.eth',
    defaultMessage: 'ETH rewards available on sorare',
  },
  ethSub: {
    id: 'Landing.Prizes.ethSub',
    defaultMessage: 'ETH',
  },
  fly: {
    id: 'Landing.Prizes.fly',
    defaultMessage: 'Fly with AC MILAN',
  },
  access: {
    id: 'Landing.Prizes.access',
    defaultMessage: 'Access',
  },
  julio: {
    id: 'Landing.Prizes.julio',
    defaultMessage: 'Julio Rodríguez personalized video',
  },
});

const Wrapper = styled(ContentContainer)``;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin-top: calc(var(--unit) * 15);
  padding-bottom: var(--triple-unit);

  border-bottom: 1px solid rgba(255, 255, 255, 0.17);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--intermediate-unit);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding: 0;
    border: none;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  font-family: 'Druk Wide';
  text-transform: uppercase;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 24px;
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 28px;
  }
`;

const SubtitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--quadruple-unit) 0;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    margin-bottom: var(--quadruple-unit);
    padding: var(--triple-unit) calc(var(--unit) * 5);
  }
`;

const Subtitle = styled(Text18)`
  line-height: 1.2;
  @media (min-width: ${theme.breakpoints.values.laptop}) {
    font-size: 22px;
  }
`;

const List = styled.ul`
  ${hideScrollbar}

  padding: 0;
  margin: 0;
  display: grid;
  overflow: auto;
  scroll-snap-type: x mandatory;
  grid-template-columns: repeat(4, 1fr);

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: flex;
    flex-wrap: nowrap;
  }
`;

const Prize = styled.li`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--intermediate-unit);

  scroll-snap-align: center;
  padding: var(--double-and-a-half-unit);

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  height: 65vh;
  max-height: 560px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  }

  & > * {
    z-index: 1;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    height: 55vh;
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    ${hideScrollbar}
    overflow: auto;
    height: 500px;
    flex-basis: 25%;
    transition: flex-basis 0.3s ease-in-out;

    &:hover {
      flex-basis: 70%;
      flex-grow: 2;
    }

    &.isHovered {
      * {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }
      &:not(:hover) {
        * {
          opacity: 0;
        }
      }
    }
  }
`;

const PrizeTitle = styled.p`
  width: 290px;
  font-size: 24px;
  line-height: 1.2;
  font-family: 'Druk Wide';
  text-transform: uppercase;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: 190px;
    font-size: 20px;
  }
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    width: 250px;
    font-size: 24px;
  }
`;

const PrizeLink = styled.a`
  padding: var(--unit) var(--double-unit);
  width: max-content;
  border-radius: 2em;
  display: flex;
  gap: var(--unit);
  cursor: pointer;
  background: var(--c-neutral-100);
  align-items: center;

  &:hover {
    color: inherit;
  }
`;

const ComingSoon = styled(PrizeLink)`
  backdrop-filter: blur(2px);
  cursor: default;
  background: rgba(68, 68, 68, 0.44);
`;

export const PrizesBlock = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const { formatMessage } = useIntl();
  const [isHovered, setIsHovered] = useState(false);

  const prizes = [
    {
      title: formatMessage(messages.fly),
      subtitle: formatMessage(messages.lifetime),
      cta: formatMessage(messages.watchCTA),
      image: travelImage,
      link: 'https://www.youtube.com/watch?v=mBIS0sfXMIw',
    },
    {
      title: formatMessage(messages.eth),
      subtitle: formatMessage(messages.ethSub),
      cta: formatMessage(messages.learnCTA),
      image: ethImage,
      link: 'https://medium.com/sorare/eth-rewards-are-coming-to-sorare-mlb-55602872190d',
    },
    {
      title: formatMessage(messages.sevilla),
      subtitle: formatMessage(messages.lifetime),
      cta: formatMessage(messages.watchCTA),
      image: sevillaImage,
      link: 'https://www.youtube.com/watch?v=_HSLtDIP3BU',
    },
    {
      title: formatMessage(messages.julio),
      subtitle: formatMessage(messages.access),
      cta: formatMessage(messages.learnCTA),
      image: julioRodriquez,
      comingSoon: true,
    },
  ];

  return (
    <Wrapper>
      <div>
        <TitleWrapper>
          <div>
            <img src={diamond} alt="diamond" width={24} />
          </div>
          <Title>{formatMessage(messages.title)}</Title>
        </TitleWrapper>
        <SubtitleWrapper>
          <Subtitle>{formatMessage(messages.subtitle)}</Subtitle>
        </SubtitleWrapper>
      </div>
      <List
        ref={listRef}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {prizes.map(prize => (
          <Prize
            key={prize.title}
            className={classNames({ isHovered })}
            style={{ backgroundImage: `url(${prize.image})` }}
          >
            <Text14>{prize.subtitle}</Text14>
            <PrizeTitle>{prize.title}</PrizeTitle>
            <div>
              {!prize.comingSoon ? (
                <LinkOther as={PrizeLink} target="_blank" href={prize?.link}>
                  <Text14 bold color="var(--c-neutral-1000)">
                    {prize.cta}
                  </Text14>
                </LinkOther>
              ) : (
                <ComingSoon>
                  <img src={playIcon} alt="}" width={16} height={16} />
                  <Text14 bold color="var(--c-neutral-100)">
                    {formatMessage(messages.comingSoon)}
                  </Text14>
                </ComingSoon>
              )}
            </div>
          </Prize>
        ))}
      </List>
    </Wrapper>
  );
};
