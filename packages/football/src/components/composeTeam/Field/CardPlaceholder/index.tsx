import classnames from 'classnames';
import { FC } from 'react';
import styled from 'styled-components';

import { LineupPosition } from '@sorare/core/src/lib/players';

import CardPlaceholderInfo from '@sorare/football/src/components/card/CardPlaceholderInfo';

const CardPlaceholder = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--c-static-rgb-neutral-100), 0.05);
  border: 2px solid rgba(var(--c-static-rgb-neutral-100), 0.1);
  border-radius: var(--unit);
  width: 100%;
  aspect-ratio: 21 / 34;
  color: var(--c-static-neutral-100);
  cursor: pointer;
  &:hover,
  &:focus {
    background: rgba(var(--c-static-rgb-neutral-100), 0.1);
    border: 2px solid rgba(var(--c-static-rgb-neutral-100), 0.15);
  }
  &.selected {
    background: rgba(var(--c-rgb-brand-600), 0.5);
    border: 2px solid var(--c-brand-600);
  }
`;

export type Props = FC<{
  onClick: () => void;
  selected: boolean;
  position: LineupPosition;
}>;
const CardPlaceholderWrapper: Props = ({ onClick, selected, position }) => {
  return (
    <CardPlaceholder className={classnames({ selected })} onClick={onClick}>
      <CardPlaceholderInfo position={position} />
    </CardPlaceholder>
  );
};

export default CardPlaceholderWrapper;
