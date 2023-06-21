import styled from 'styled-components';

import { theme } from '@core/style/theme';

interface Props {
  count: number;
  className?: string;
}

const HideMobile = styled.div`
  display: none;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
