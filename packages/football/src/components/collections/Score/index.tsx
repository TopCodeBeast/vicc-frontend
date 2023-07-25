import styled from 'styled-components';

import Lightning from '@sorare/core/src/atoms/icons/Lightning';
import { Text16 } from '@sorare/core/src/atoms/typography';

const Wrapper = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

const ImgWrapper = styled.span`
  width: var(--intermediate-unit);
  display: flex;
  justify-content: center;
`;

type Props = { score: number; suffix?: string | null };

export const Score = ({ score, suffix }: Props) => {
  return (
    <Wrapper>
      <Text16 bold>
        {score}
        {suffix}
      </Text16>
      <ImgWrapper>
        <Lightning />
      </ImgWrapper>
    </Wrapper>
  );
};
