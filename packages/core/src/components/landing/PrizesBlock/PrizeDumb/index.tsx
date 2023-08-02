import classNames from 'classnames';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { LinkOther } from '@core/atoms/navigation/Box';
import { Text14 } from '@core/atoms/typography';
import {
  desktopAndAbove,
  laptopAndAbove,
  tabletAndAbove,
} from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

import playIcon from './assets/playIcon.svg';

const Prize = styled(LinkOther)`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--intermediate-unit);

  scroll-snap-align: center;
  padding: var(--double-and-a-half-unit);

  &.disabled {
    cursor: default;
  }

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  height: 65vh;
  max-height: 560px;

  &::before {
    content: '';
    inset: 0;
    position: absolute;
    pointer-events: none;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  }

  & > * {
    z-index: 1;
  }

  @media ${tabletAndAbove} {
    height: 55vh;
  }
  @media ${laptopAndAbove} {
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

  @media ${laptopAndAbove} {
    width: 190px;
    font-size: 20px;
  }
  @media ${desktopAndAbove} {
    width: 250px;
    font-size: 24px;
  }
`;

const PrizeLink = styled.span`
  padding: var(--unit) var(--double-unit);
  width: max-content;
  border-radius: 2em;
  display: flex;
  gap: var(--unit);
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

type CommingSoonProps = {
  cta: string;
  link?: never;
  title: string;
  bgImage: string;
  subtitle: string;
  isHovered?: boolean;
  comingSoon: boolean;
};

type Props = {
  cta: string;
  link: string;
  title: string;
  bgImage: string;
  subtitle: string;
  isHovered?: boolean;
  comingSoon?: never;
};

export const PrizeDumb = ({
  cta,
  link,
  title,
  bgImage,
  subtitle,
  isHovered,
  comingSoon,
}: Props | CommingSoonProps) => {
  const { formatMessage } = useIntl();

  return (
    <Prize
      target="_blank"
      href={link}
      className={classNames({ isHovered, disabled: comingSoon })}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Text14>{subtitle}</Text14>
      <PrizeTitle>{title}</PrizeTitle>
      <div>
        {!comingSoon ? (
          <PrizeLink>
            <Text14 bold color="var(--c-neutral-1000)">
              {cta}
            </Text14>
          </PrizeLink>
        ) : (
          <ComingSoon>
            <img src={playIcon} alt="}" width={16} height={16} />
            <Text14 bold color="var(--c-neutral-100)">
              {formatMessage({
                id: 'Landing.Prizes.comingSoon',
                defaultMessage: 'Coming soon',
              })}
            </Text14>
          </ComingSoon>
        )}
      </div>
    </Prize>
  );
};
