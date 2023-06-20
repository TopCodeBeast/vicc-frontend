import classNames from 'classnames';
import { animated, useSpring } from '@react-spring/web';
import { useMeasure } from 'react-use';
import styled from 'styled-components';

type Options =
  | {
      baseHeight: number;
      fadeHeight: number;
    }
  | undefined;
const Wrapper = styled(animated.div)<{ $fadeHeight?: number }>`
  position: relative;
  overflow: hidden;
  ${({ $fadeHeight }) =>
    $fadeHeight &&
    `&.collapsed {
      mask-image: linear-gradient(
        0deg,
        transparent 0%,
        black calc(0% + ${$fadeHeight}px)
      );
    }
  `}
`;

type Props = {
  open: boolean;
  options?: Options;
  children: React.ReactNode;
};
export const Collapsible = ({ open: openProp, options, children }: Props) => {
  const [measurementDiv, { height }] = useMeasure<HTMLDivElement>();
  const open = openProp || height < (options?.baseHeight || 0);

  const springArg = {
    to: {
      opacity: open ? 1 : 0,
      height: open ? height : options?.baseHeight || 0,
    },
  };
  if ((options?.baseHeight || 0) > 0) {
    springArg.to.opacity = 1;
  }

  return (
    <Wrapper
      className={classNames({ collapsed: !open })}
      style={useSpring(springArg)}
      $fadeHeight={options?.fadeHeight}
    >
      <div ref={measurementDiv}>{children}</div>
    </Wrapper>
  );
};

export default Collapsible;
