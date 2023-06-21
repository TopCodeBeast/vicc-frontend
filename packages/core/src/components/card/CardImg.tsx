import styled, { css } from 'styled-components';

import cardPlaceholder from '@core/assets/card_placeholder.svg';
import ResponsiveImg, {
  ValidWidths,
  getClosestStandardWidth,
} from '@core/atoms/ui/ResponsiveImg';
import { theme } from '@core/style/theme';

const WIDTH = 21;
const HEIGHT = 34;

export const placeholderCss = css`
  position: absolute;
  background: var(--c-neutral-300) url(${cardPlaceholder}) no-repeat center;
  background-size: cover;
  background-position: top center;
  border-radius: ${theme.radius.xs}px;
  content: '';
  inset: 0;
  z-index: -1;
`;

type CardImgProps = {
  width?: ValidWidths;
  height?: number;
  fallback?: string;
  alt?: string;
};
export const CardImg = styled(ResponsiveImg).attrs<CardImgProps>(
  ({ width, height, fallback, alt }) => ({
    width: width || WIDTH,
    height: height || (HEIGHT / WIDTH) * +(width || WIDTH),
    cropWidth: getClosestStandardWidth(width || WIDTH),
    fallback: fallback ?? cardPlaceholder,
    alt: alt ?? '',
  })
)<CardImgProps>`
  height: auto;
  width: 100%;
`;

export const CardImgLoadingWrapper = styled.div<{ loaded: boolean }>`
  position: relative;
  &::before {
    ${placeholderCss}
    opacity: ${props => (props.loaded ? '0' : '1')};
    pointer-events: none;
    transition: opacity 0.1s ease-out;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .dark-theme & {
      background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(0, 0, 0, 0) 100%
        ),
        var(--c-neutral-200);
    }
  }
`;
