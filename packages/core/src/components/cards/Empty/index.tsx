import { ReactNode } from 'react';
import styled from 'styled-components';

import { Title3 } from '@core/atoms/typography';

import EmptyCards from './cards.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--double-unit);
  margin: calc(var(--unit) * 5) 0;
  text-align: center;
`;

const Image = styled.img`
  aspect-ratio: 125 / 100;
  width: 240px;
`;

export const Empty = ({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) => {
  return (
    <Wrapper>
      <Image src={EmptyCards} alt="" />
      <Title3 color="var(--c-neutral-1000)">{title}</Title3>
      <footer>{description}</footer>
    </Wrapper>
  );
};
