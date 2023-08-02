import styled from 'styled-components';

import { breakpoints, desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  perspective: 1000px;
  overflow: hidden;
  --containerHeight: 700px;
  max-height: var(--containerHeight);
  background-size: contain;
  background-position: right center;
  min-height: 100%;
`;

const Columns = styled.div`
  transform-style: preserve-3d;
  display: flex;
  justify-content: space-around;
  gap: min(calc(15 * var(--unit)), 6vw);

  @media (max-width: ${breakpoints.desktop}px) {
    height: 100%;
  }

  @media ${desktopAndAbove} {
    transform: rotateX(5deg) rotateZ(-10deg) translateX(25%);
    gap: min(calc(15 * var(--unit)), 10vw);
  }
`;

const Img = styled.img`
  width: 100%;
`;

const MobileColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0.18;
  gap: calc(3 * var(--unit));
  transform: rotateX(5deg) rotateZ(-16deg);

  @media ${tabletAndAbove} {
    flex: 1;
    flex-shrink: 1;
  }
`;

type Props = {
  multiFacedCardsUrlsColumns: string[][][];
  className?: string;
};

export const MobileBackground = ({
  multiFacedCardsUrlsColumns,
  className,
}: Props) => {
  return (
    <Wrapper className={className}>
      <Columns>
        {multiFacedCardsUrlsColumns.slice(0, 5).map((column, columnIndex) => (
          <MobileColumn
            // eslint-disable-next-line react/no-array-index-key
            key={columnIndex}
            style={
              {
                '--nbCards': column.length,
                paddingTop: columnIndex % 2 === 0 ? '1.5vh' : '0',
              } as React.CSSProperties
            }
          >
            {column.slice(0, 4).map((faces, cardIndex) => {
              const url = faces[(columnIndex + cardIndex) % faces.length];

              return (
                <Img
                  // eslint-disable-next-line react/no-array-index-key
                  key={`card-${cardIndex}`}
                  src={url}
                  alt=""
                  loading="lazy"
                />
              );
            })}
          </MobileColumn>
        ))}
      </Columns>
    </Wrapper>
  );
};
