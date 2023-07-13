import classnames from 'classnames';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { scarcityNames } from '@core/lib/cards';

const Root = styled.div`
  isolation: isolate;
  position: relative;

  .dark-theme & {
    color: var(--c-neutral-1000);
    background: linear-gradient(
        180deg,
        rgba(var(--c-rgb-neutral-100), 0.8) 0%,
        var(--c-neutral-200) 375px
      ),
      var(--bg);
    &.common {
      --bg: var(--c-gradient-common);
    }
    &.limited {
      --bg: var(--c-gradient-limited);
    }
    &.rare {
      --bg: var(--c-gradient-rare);
    }
    &.super_rare {
      --bg: var(--c-gradient-superRare);
    }
    &.unique {
      --bg: var(--c-gradient-unique);
    }
    &.custom_series {
      --bg: var(--c-gradient-customSeries);
    }
  }
`;
const BackgroundSVG = styled.svg`
  max-height: 100%;
  margin: auto;
  position: absolute;
  z-index: -1;
  inset: 0;
  user-select: none;
  pointer-events: none;
`;
const RarityLabel = styled.text`
  fill: rgba(var(--c-rgb-neutral-1000), 0.05);
  font-size: 50px;
  font-weight: bold;
`;

type Props = { rarity?: string; withRarityText?: boolean; className?: string };
const RarityGradientBackground = ({
  rarity,
  withRarityText,
  className,
  children,
}: PropsWithChildren<Props>) => {
  const rarityTextLines =
    rarity && scarcityNames[rarity] ? scarcityNames[rarity].split(' ') : [];
  return (
    <Root className={classnames(className, rarity)}>
      {withRarityText && rarityTextLines.length && (
        <BackgroundSVG viewBox={`0 0 250 ${100 + rarityTextLines.length * 50}`}>
          {rarityTextLines.map((line, i) => (
            <RarityLabel
              key={line}
              textAnchor="middle"
              x={125}
              y={(i + 2) * 50}
            >
              {line}
            </RarityLabel>
          ))}
        </BackgroundSVG>
      )}
      {children}
    </Root>
  );
};

export default RarityGradientBackground;
