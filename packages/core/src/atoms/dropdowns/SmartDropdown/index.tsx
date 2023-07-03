import { FC } from 'react';
import styled from 'styled-components';

import Dropdown, { Props as DropdownProps } from '../Dropdown';

type Props = Omit<DropdownProps, 'children'> & {
  children: (FC<{ closeDropdown?: () => void }> | undefined | null | false)[];
};

export const Item = styled.button`
  color: var(--c-neutral-1000);
  flex: 1;
  padding: var(--unit) var(--double-unit);
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  &:hover,
  &:focus {
    background: var(--c-neutral-400);
  }
  &:disabled {
    background: var(--c-neutral-300);
    color: var(--c-neutral-600);
  }
`;

export const ItemText = styled.span`
  flex: 1;
  display: inline-flex;
  justify-self: flex-start;
  font: var(--t-bold) var(--t-16);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--c-neutral-300);
`;

// SmartDropdown renders a dropdown only when the list of actions is strictly bigger than 1
export const SmartDropdown = ({ children, ...rest }: Props) => {
  const truthyChildren = children.filter(Boolean);
  if (truthyChildren.length === 0) {
    return null;
  }
  if (truthyChildren.length === 1) {
    return <div>{truthyChildren.map(c => c({}))}</div>;
  }

  return (
    <Dropdown {...rest}>
      {({ closeDropdown }: { closeDropdown: () => void }) => (
        <Wrapper>{truthyChildren.map(c => c({ closeDropdown }))}</Wrapper>
      )}
    </Dropdown>
  );
};

export default SmartDropdown;
