import styled, { css } from 'styled-components';

import { FullWidthContainer } from '@sorare/core/src/atoms/container';
import { Text20 } from '@sorare/core/src/atoms/typography';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

export const Img = styled.img`
  width: 100%;
`;

export const ResetFontSizeContainer = styled.div`
  font-size: 0;
`;

const BlackLayerSection = css`
  &:before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: linear-gradient(
      var(--direction-degree),
      rgba(0, 0, 0, 0.5) 40%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

export const Section = styled.div<{
  spacing?: boolean;
  center?: boolean;
  blackLayer?: 'left' | 'bottom';
  keepImageOnMobile?: boolean;
}>`
  position: relative;

  ${({ spacing }) =>
    spacing &&
    css`
      padding: var(--quadruple-unit) 0;
      @media ${laptopAndAbove} {
        padding: calc(10 * var(--unit)) 0;
      }
    `}

  @media ${laptopAndAbove} {
    ${({ center }) =>
      center &&
      css`
        text-align: center;
      `}
  }

  ${({ blackLayer, keepImageOnMobile }) =>
    blackLayer &&
    css`
      --direction-degree: ${blackLayer === 'bottom' ? '0deg' : '90deg'};

      ${keepImageOnMobile && BlackLayerSection}
      @media ${laptopAndAbove} {
        ${BlackLayerSection}
      }
    `}
`;

export const ImageSection = styled(Section)<{
  vAlignContent: 'center' | 'bottom';
  keepImageOnMobile?: boolean;
}>`
  max-width: 100%;
  background-size: cover;
  background-position: top center;
  position: relative;

  ${({ keepImageOnMobile }) =>
    keepImageOnMobile
      ? css`
          padding: calc(10 * var(--unit)) 0;
        `
      : css`
          padding: var(--quadruple-unit) 0;
        `}

  @media ${laptopAndAbove} {
    display: flex;
    aspect-ratio: 18/8;
    padding: var(--quadruple-unit) 0;

    ${({ vAlignContent }) =>
      vAlignContent === 'center'
        ? css`
            align-items: center;
          `
        : css`
            align-items: flex-end;
            padding-bottom: 3%;
          `}
  }
`;

export const BlackLayer = styled.div<{ from?: 'left' | 'bottom' }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  --direction-degree: ${({ from }) => (from === 'bottom' ? '0deg' : '90deg')};
  background: linear-gradient(
    var(--direction-degree),
    rgba(0, 0, 0, 0.5) 40%,
    rgba(0, 0, 0, 0) 100%
  );
`;

export const StyledContainer = styled(FullWidthContainer)`
  position: relative;
  padding: 0 var(--double-unit);
`;

export const TwoColumnsContainer = styled.div<{ image: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--quadruple-unit);

  @media ${laptopAndAbove} {
    display: grid;

    ${({ image }) =>
      image === 'left'
        ? css`
            grid-template-columns: 10fr 8fr;
          `
        : css`
            grid-template-columns: 8fr 10fr;
          `}

    gap: calc(10 * var(--unit));
  }
`;

const StyledText20 = styled(Text20)<{ white?: boolean }>`
  ${({ white }) =>
    white &&
    css`
      color: var(--c-neutral-100);
      ${ImageSection} & {
        color: var(--c-neutral-1000);
        @media ${laptopAndAbove} {
          color: var(--c-neutral-100);
        }
      }
    `}
`;

export const Title = styled(StyledText20)`
  font-size: 24px;
  line-height: 1.8;
  @media ${laptopAndAbove} {
    font-size: 33px;
  }

  font-weight: 900;
  margin-bottom: var(--double-unit);
  @media ${laptopAndAbove} {
    margin-bottom: var(--quadruple-unit);
  }
`;

export const Text = styled(StyledText20)<{ spacingAfter?: boolean }>`
  line-height: 1.8;
  @media ${laptopAndAbove} {
    font-size: 23px;
  }

  & a {
    color: inherit;
    text-decoration: underline;
  }

  ${({ spacingAfter }) =>
    spacingAfter &&
    css`
      margin-bottom: var(--quadruple-unit);
      @media ${laptopAndAbove} {
        margin-bottom: calc(8 * var(--unit));
      }
    `}
`;
