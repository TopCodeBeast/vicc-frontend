import classnames from 'classnames';
import { Children, FC, useState } from 'react';
import styled from 'styled-components';

const Group = styled.div`
  display: inline-flex;
  align-items: strech;
  border-radius: 2em;
  background: var(--c-neutral-100);
  border: 1px solid var(--c-neutral-300);
  height: var(--quadruple-unit);
  color: var(--c-neutral-1000);
  > button {
    padding: 0 var(--double-unit);
    min-width: min-content;
    &:first-child {
      border-top-left-radius: inherit;
      border-bottom-left-radius: inherit;
    }
    &:last-child {
      border-top-right-radius: inherit;
      border-bottom-right-radius: inherit;
    }
    > * {
      display: block;
    }
    &.active,
    &:hover,
    &:focus {
      background: var(--c-neutral-200);
    }
  }
  .dark-theme & {
    background: var(--c-neutral-300);
    border: 2px solid var(--c-neutral-400);
    > button {
      &.active {
        background: rgba(var(--c-rgb-neutral-400), 0.4);
      }
      &:hover,
      &:focus {
        background: rgba(var(--c-rgb-neutral-400), 0.3);
      }
    }
  }
`;

type Props = {
  defaultValue?: number;
  onChange: (index: number) => void;
};

const ButtonGroup: FC<React.PropsWithChildren<Props>> = ({
  children,
  defaultValue,
  onChange,
}) => {
  const [state, setState] = useState(defaultValue);
  const change = (i: number) => {
    setState(i);
    onChange(i);
  };
  return (
    <Group>
      {Children.map(children, (child, i) => (
        <button
          type="button"
          // eslint-disable-next-line react/no-array-index-key
          key={`buttonGroup_button_${i}`}
          onClick={() => change(i)}
          className={classnames({ active: state === i })}
        >
          {child}
        </button>
      ))}
    </Group>
  );
};

export default ButtonGroup;
