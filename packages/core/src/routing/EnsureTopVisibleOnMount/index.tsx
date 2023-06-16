import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import usePrevious from '@sorare/core/src/hooks/usePrevious';

export const EnsureTopVisibleOnMount = ({
  children,
}: {
  children: ReactNode;
}) => {
  const location = useLocation();
  const backgroundLocation = useBgLocation();
  const prevBackgroundLocation = usePrevious(backgroundLocation?.pathname);
  const [hasClosedModal, setHasClosedModal] = useState<boolean>(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (hasClosedModal) {
      setHasClosedModal(false);
    }
  }

  useEffect(() => {
    if (!backgroundLocation?.pathname) {
      if (!hasClosedModal && !prevBackgroundLocation) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setHasClosedModal(true);
    }
  }, [
    location.pathname,
    backgroundLocation?.pathname,
    prevBackgroundLocation,
    hasClosedModal,
  ]);

  return <div>{children}</div>;
};
