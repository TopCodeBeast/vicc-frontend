import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

interface Props {
  count: number;
  className?: string;
}

const HideMobile = styled.div`
  display: none;

  @media ${tabletAndAbove} {
    display: unset;
  }
`;

export const FlexFill = ({ count, className }: Props) => {
  return (
    <>
      {Array(Math.max(count, 0))
        .fill(null)
        .map((val, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <HideMobile key={index} className={className} />
        ))}
    </>
  );
};

export default FlexFill;
