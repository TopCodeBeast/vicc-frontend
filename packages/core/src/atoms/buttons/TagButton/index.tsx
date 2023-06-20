import { gql } from '@apollo/client';
import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text16 } from '@sorare/core/src/atoms/typography';

interface Props {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  big?: boolean;
}

const Button = styled(Block)`
  height: 30px;
  padding: 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-neutral-800);
  &.big {
    height: 40px;
  }
  &.disabled {
    opacity: 0.5;
  }
  &.selected {
    border: 1px solid rgba(var(--c-rgb-brand-600), 0.25);
    background-color: rgba(var(--c-rgb-brand-600), 0.25);
  }
`;

export const TagButton = ({
  children,
  selected,
  onClick,
  disabled = false,
  big = false,
}: Props) => {
  return (
    <Button
      onClick={onClick}
      className={classnames({
        selected,
        big,
      })}
      noCollapse
      disabled={disabled}
    >
      <Text16 bold>{children}</Text16>
    </Button>
  );
};

TagButton.fragments = {
  card: gql`
    fragment TagButton_card on Card {
      slug
      assetId
    }
  `,
};

export default TagButton;
