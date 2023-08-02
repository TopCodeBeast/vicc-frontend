import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { DrukWide24 } from '../typography';

const Wrapper = styled.div<{ right?: boolean }>`
  display: flex;
  gap: var(--double-unit);
  ${({ right }) => right && 'flex-direction: row-reverse;'}
  @media ${tabletAndAbove} {
    gap: var(--quadruple-unit);
  }
`;

const Decoration = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;
const DecorationText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: rotate(-90deg);
  text-transform: uppercase;
  white-space: nowrap;
  width: var(--double-unit);
  height: var(--quadruple-unit);
`;
const Line = styled.div`
  width: 1px;
  min-height: var(--double-unit);
  flex-grow: 1;
  background-color: var(--c-static-neutral-100);
`;
const Dot = styled.div`
  width: var(--intermediate-unit);
  height: var(--intermediate-unit);
  background-color: var(--c-pink-600);
  border-radius: 50%;
  flex-shrink: 0;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--quadruple-unit);
`;

const Row = styled.div`
  display: grid;
  grid-row-gap: var(--quadruple-unit);
  width: 100%;
  flex-direction: column;
  @media ${tabletAndAbove} {
    display: flex;
    flex-direction: row;
    gap: var(--double-unit);
  }
`;

type Props = {
  items: ReactNode[];
  title: ReactNode;
  decorationText: ReactNode;
  right?: boolean;
};
export const DecoratedRow = ({
  items,
  title,
  decorationText,
  right,
}: Props) => {
  return (
    <Wrapper right={right}>
      <Decoration>
        <DecorationText>
          <Text16 color="var(--c-pink-600)">{decorationText}</Text16>
        </DecorationText>
        <Line />
        <Dot />
      </Decoration>
      <Content>
        <DrukWide24 color="var(--c-static-neutral-100)">{title}</DrukWide24>
        <Row>{items.map(item => item)}</Row>
      </Content>
    </Wrapper>
  );
};

export default DecoratedRow;
