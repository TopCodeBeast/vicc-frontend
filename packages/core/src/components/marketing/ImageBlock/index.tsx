import { ComponentProps, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

import { DrukWide64, Romie20 } from '../typography';

type Props = Omit<ComponentProps<'img'>, 'ref'> & {
  legendTitle?: ReactNode;
  legendDesc?: ReactNode;
  cover?: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(3 * var(--double-and-a-half-unit));
  @media ${tabletAndAbove} {
    flex-direction: row;
    gap: calc(6 * var(--double-and-a-half-unit));
  }
`;
const Metas = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  padding-left: var(--double-and-a-half-unit);
  border-left: var(--half-unit) solid var(--c-pink-600);
`;

const LegendTitle = styled(DrukWide64)`
  font-size: 64px;
`;

const LegendDesc = styled(Romie20)`
  font-style: italic;
`;

const ImgCtn = styled.div`
  display: flex;
  flex-shrink: 1;
  overflow: hidden;
`;

const Img = styled.img<{ cover?: boolean }>`
  width: 100%;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.015);
  }
  ${({ cover }) =>
    cover &&
    css`
      aspect-ratio: 1;
      object-fit: cover;
      @media ${tabletAndAbove} {
        aspect-ratio: 2;
      }
    `}
`;

export const ImageBlock = ({
  legendTitle,
  legendDesc,
  alt,
  cover,
  ...rest
}: Props) => {
  return (
    <Wrapper>
      {(legendTitle || legendDesc) && (
        <Metas>
          {legendTitle && <LegendTitle>{legendTitle}</LegendTitle>}
          {legendDesc && <LegendDesc>{legendDesc}</LegendDesc>}
        </Metas>
      )}
      <ImgCtn>
        <Img {...rest} cover={cover} />
      </ImgCtn>
    </Wrapper>
  );
};
export default ImageBlock;
