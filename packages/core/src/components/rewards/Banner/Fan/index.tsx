import { ReactElement } from 'react';
import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: var(--fan-wrapper-width, 120px);
  height: var(--fan-wrapper-width, 120px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ElementInFan = styled(animated.div)`
  position: absolute;
  transform-origin: center bottom;
  width: var(--fan-element-width, calc(8 * var(--unit)));
  > * {
    box-shadow: var(
      --element-in-fan-box-shadow,
      0 var(--unit) var(--unit) rgba(0, 0, 0, 0.5)
    );
  }
`;

type Props = {
  elements: ReactElement[];
};

export const Fan = ({ elements }: Props) => {
  const spring = useSpring({
    from: { fanOut: 0 },
    to: { fanOut: 1 },
    delay: 500,
  });

  if (elements.length === 0) {
    return null;
  }

  const fanAngle = Math.min((elements.length - 1) * 15, 45);
  const cardFanAngle =
    elements.length === 1 ? 0 : fanAngle / (elements.length - 1);
  const tilt = Math.min(-5, fanAngle / -2);

  return (
    <Wrapper>
      {elements.map((element, index) => {
        return (
          <ElementInFan
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{
              transform: spring.fanOut.to(
                fanOut =>
                  `rotate(${
                    fanOut * cardFanAngle * (elements.length - index - 1) +
                    tilt * fanOut
                  }deg)`
              ),
            }}
          >
            {element}
          </ElementInFan>
        );
      })}
    </Wrapper>
  );
};
