import classnames from 'classnames';
import styled from 'styled-components';

import { range } from '@core/lib/arrays';

const Root = styled.div`
  --size: 6px;
  --padding: calc(var(--unit) / 2);
  --paddingBox: calc(var(--size) + 2 * var(--padding));
  display: flex;
  transform: translateX(calc(var(--paddingBox) / -2));
`;
const Dot = styled.button`
  opacity: 0.3;
  padding: var(--padding);
  transition: 0.25s ease-in-out transform;
  cursor: pointer;
  &::before {
    content: '';
    display: block;
    background: currentColor;
    width: var(--size);
    height: var(--size);
    border-radius: var(--size);
  }
  &:hover {
    opacity: 0.8;
  }
  &.selected {
    opacity: 1;
    position: absolute;
    transform: translateX(calc(var(--selectedIndex) * var(--paddingBox)));
  }
  :not(.selected).after {
    transform: translateX(var(--paddingBox));
  }
`;

type Props = {
  titles: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};
const Dots = ({ selectedIndex, titles, setSelectedIndex }: Props) => {
  if (titles.length < 1) {
    return null;
  }
  return (
    <Root style={{ '--selectedIndex': selectedIndex } as React.CSSProperties}>
      <Dot className="selected" as="div" />
      {range(titles.length - 1).map((_, index) => {
        const slotIndex = index < selectedIndex ? index : index + 1;
        const title = titles[slotIndex];
        return (
          <Dot
            // We need to use index and not slotname here as we reuse slots
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            title={title}
            className={classnames({ after: index >= selectedIndex })}
            onClick={() => {
              setSelectedIndex(slotIndex);
            }}
          />
        );
      })}
    </Root>
  );
};

export default Dots;
