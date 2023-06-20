import { SpringValue, animated } from '@react-spring/web';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: var(--unit);
  padding: 2px;
  background: linear-gradient(
    90deg,
    rgba(166, 249, 226, 0.1) 0%,
    rgba(255, 255, 255, 0.1) 19.27%,
    rgba(240, 182, 185, 0.1) 36.98%,
    rgba(166, 249, 226, 0.1) 62.18%,
    rgba(255, 255, 255, 0.1) 81.25%,
    rgba(200, 189, 251, 0.1) 100%
  );
  border-radius: 3px;
`;
const Filled = styled(animated.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    #a6f9e2 0%,
    #ffffff 19.27%,
    #f0b6b9 36.98%,
    #a6f9e2 62.18%,
    #ffffff 81.25%,
    #c8bdfb 100%
  );
  border-radius: 3px;
  max-width: 100%;
`;

type Props = {
  percentage: SpringValue<string>;
};
export const Gauge = ({ percentage }: Props) => {
  return (
    <Root>
      <Filled style={{ width: percentage }} />
    </Root>
  );
};

export default Gauge;
