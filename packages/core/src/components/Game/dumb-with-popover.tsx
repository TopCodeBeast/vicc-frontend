import { ReactNode } from 'react';
import styled from 'styled-components';

import { theme } from '@core/style/theme';

import { GamePopover } from './GamePopover';
import { Game as DumbGame } from './dumb';

const Wrapper = styled.div`
  border-radius: ${theme.shape.borderRadius}px;
  background-color: var(--c-neutral-100);
  padding: calc(3 * var(--unit));
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = React.ComponentProps<typeof DumbGame> & {
  PopoverContent?: ReactNode;
};

export const Game = (props: Props) => {
  const { id, PopoverContent } = props;

  if (!PopoverContent) {
    return <DumbGame {...props} />;
  }
  return (
    <GamePopover
      gameId={id}
      popoverElement={<Wrapper>{PopoverContent}</Wrapper>}
    >
      <DumbGame {...props} hoverable />
    </GamePopover>
  );
};
