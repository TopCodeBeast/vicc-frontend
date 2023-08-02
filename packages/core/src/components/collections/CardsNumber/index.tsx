import styled from 'styled-components';

import CircularProgress from '@core/atoms/loader/CircularProgress';
import { Caption, Text16 } from '@core/atoms/typography';

const Wrapper = styled.div`
  display: flex;
  gap: var(--half-unit);
`;

const StyledProgress = styled(CircularProgress)`
  width: var(--intermediate-unit);
  --circular-progress-stroke: var(--c-green-800);
`;

type Props = { ownedCards: number; totalCards: number };

export const CardsNumber = ({ ownedCards, totalCards }: Props) => {
  return (
    <Wrapper>
      <span>
        <Text16 bold as="span">
          {ownedCards}
        </Text16>
        <Caption as="span">/{totalCards}</Caption>
      </span>

      <StyledProgress maxProgress={totalCards} progress={ownedCards} />
    </Wrapper>
  );
};
