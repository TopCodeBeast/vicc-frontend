import { Game as DumbGame } from './dumb';
import { Game as DumbGameWithPopover } from './dumb-with-popover';

type Props = React.ComponentProps<typeof DumbGameWithPopover>;

export const Game = ({ PopoverContent, ...props }: Props) => {
  if (PopoverContent) {
    return <DumbGameWithPopover PopoverContent={PopoverContent} {...props} />;
  }
  return <DumbGame {...props} />;
};
