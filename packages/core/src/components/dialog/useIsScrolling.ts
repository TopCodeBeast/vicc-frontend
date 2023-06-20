import { useState } from 'react';

const useIsScrolling = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  return {
    // Hacky solution to disable close event if user click on scrollbar
    // This is done on mouseDown to prevent the dialog to close if the user
    // click on the scrollbar, mouve the mouse further right and release the click.
    // 20px is an rough estimate of all scrollbar size, event for macos.
    clickDown: (event: React.MouseEvent<HTMLDivElement>) => {
      setIsScrolling(event.clientX > window.innerWidth - 20);
    },
    clickUp: () => {
      setIsScrolling(false);
    },
    isScrolling,
  };
};

export default useIsScrolling;
