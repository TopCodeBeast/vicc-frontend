import { ListItemText } from '@material-ui/core';
import classnames from 'classnames';
import { ReactElement, ReactNode } from 'react';
import styled, { StyledComponent } from 'styled-components';

import cardPlaceholder from '@core/assets/card_placeholder.svg';

interface Props {
  avatar?: ReactElement;
  renderAvatar?: (
    props: StyledComponent<'img', any, Record<string, unknown>, never>
  ) => ReactNode;
  primary: string | ReactElement;
  secondary?: string;
  isHighlighted: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  border-radius: var(--unit);
  padding: var(--half-unit) 0;
  cursor: pointer;
  &:hover,
  &.highlighted {
    background: var(--c-neutral-300);
  }
`;
const Avatar = styled.div`
  width: calc(5 * var(--unit));
  aspect-ratio: 1;
  border-radius: var(--unit);
  overflow: hidden;
`;
const Img = styled.img<{ isContain: boolean }>`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ isContain }) => (isContain ? 'contain' : 'cover')};
  &::before {
    position: absolute;
    inset: 0;
    font-size: 0;
    content: '';
    background: var(--c-neutral-300) url(${cardPlaceholder}) no-repeat top;
    background-size: cover;
  }
`;
export const Suggestion = ({
  avatar,
  renderAvatar,
  primary,
  secondary = '',
  isHighlighted,
}: Props) => {
  return (
    <Container className={classnames({ highlighted: isHighlighted })}>
      <Avatar>{renderAvatar?.(Img) || avatar}</Avatar>
      <ListItemText primary={primary} secondary={secondary} />
    </Container>
  );
};

export default Suggestion;
