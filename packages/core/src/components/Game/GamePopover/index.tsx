import { Popover } from '@material-ui/core';
import { MouseEvent, ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
  popoverElement: ReactNode;
  gameId: string;
};

export const GamePopover = (props: Props) => {
  const { children, gameId, popoverElement } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverId = `popover-${gameId}`;
  return (
    <div>
      <div
        aria-owns={open ? popoverId : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {children}
      </div>
      <Popover
        id={popoverId}
        style={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {popoverElement}
      </Popover>
    </div>
  );
};
