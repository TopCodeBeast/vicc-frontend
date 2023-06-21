import { useDrag } from '@use-gesture/react';
import classnames from 'classnames';
import { ReactNode, useEffect, useRef } from 'react';
import { animated, config, useSpring } from '@react-spring/web';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  /* can be overriden from outside */
  --slotSize: 200px;
  transition: 0.5s ease-in-out transform;
  transform-style: preserve-3d;
  perspective: 500px;
  width: var(--slotSize);
  aspect-ratio: var(--card-aspect-ratio);
  user-select: none;
`;

const ElementWrapper = styled(animated.div)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform-origin: center;
  transform-style: preserve-3d;
  width: 100%;
  height: 100%;
  transition: 0.5s ease-in opacity;
  cursor: pointer;
  filter: drop-shadow(0 0 var(--unit) rgba(0, 0, 0, 0.5));
  * {
    transform-style: preserve-3d;
  }
`;

type Props<T> = {
  elements: T[];
  renderElement: (element: T, index: number) => ReactNode;
  selectedIndex: number;
  setSelectedIndex?: (index: number) => void;
  onClick: (element: T, index: number) => void;
  style?: React.CSSProperties;
};

export const Carousel = <T,>({
  elements,
  renderElement,
  selectedIndex,
  setSelectedIndex,
  onClick,
  style,
}: Props<T>) => {
  const target = useRef<HTMLDivElement | null>(null);

  const [value, api] = useSpring(() => ({
    config: config.stiff,
    to: { springNumber: selectedIndex },
  }));
  useEffect(() => {
    api.start({ springNumber: selectedIndex });
  }, [selectedIndex, api]);

  const bind = useDrag(({ down, movement: [mx] }) => {
    if (setSelectedIndex) {
      const newIndex = selectedIndex - mx / 200;
      api.start({
        springNumber: down ? newIndex : selectedIndex,
        immediate: down,
      });
      if (!down) {
        setSelectedIndex(Math.round(newIndex));
      }
    }
  });

  return (
    <Wrapper ref={target} style={style} {...bind()}>
      {elements.map((element, index) => (
        <ElementWrapper
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          onClick={() => onClick(element, index)}
          className={classnames({ selected: selectedIndex === index })}
          style={{
            // ensure click on cards make sense
            zIndex: elements.length - Math.abs(selectedIndex - index),
            // 3d carousel
            transform: value.springNumber.to(
              v => `translateZ( calc(${Math.abs(
                index - v
              )} * var(--slotSize) / -2) )
              translateX(calc(${index - v} * var(--slotSize) / 1.5))
              rotateY(calc(${
                Math.sign(v - index) * Math.min(1.4, Math.abs(v - index))
              } * 60deg))`
            ),
          }}
        >
          {renderElement(element, index)}
        </ElementWrapper>
      ))}
    </Wrapper>
  );
};
