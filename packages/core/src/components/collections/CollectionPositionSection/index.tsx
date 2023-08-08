import { ReactNode } from 'react';
import styled from 'styled-components';

import { Title4 } from '@core/atoms/typography';
import { tabletAndAbove } from '@core/style/mediaQuery';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--triple-unit);

  @media ${tabletAndAbove} {
    margin-bottom: var(--quadruple-unit);
  }
`;

const Title = styled(Title4)`
  display: flex;
  gap: var(--unit);
  margin-bottom: var(--double-unit);
`;

const Dimmed = styled.span`
  color: var(--c-neutral-600);
`;

type Props = {
  positionLabel: ReactNode | string;
  numberOfSlots: number;
  numberOfFulfilledSlots: number;
  children: ReactNode;
};

export const CollectionPositionSection = ({
  positionLabel,
  numberOfSlots,
  numberOfFulfilledSlots,
  children,
}: Props) => {
  return (
    <Section>
      <Title>
        {positionLabel}{' '}
        <span>
          {numberOfFulfilledSlots}
          <Dimmed>/{numberOfSlots}</Dimmed>
        </span>
      </Title>
      {children}
    </Section>
  );
};
