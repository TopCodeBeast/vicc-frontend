import { ReactElement, useEffect } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useConnectionContext } from '@sorare/core/src/contexts/connection';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSeoContext } from '@sorare/core/src/contexts/seo';
import useAfterLoggedInTarget from '@sorare/core/src/hooks/useAfterLoggedInTarget';

interface Props {
  loggedInPath: string;
  children: ReactElement;
  metadata: {
    title: MessageDescriptor;
    description: MessageDescriptor;
    img: string;
  };
}

const LandingFootball = ({ loggedInPath, children, metadata }: Props) => {
  const { formatMessage } = useIntl();
  const { setPageMetadata } = useSeoContext();

  const { currentUser } = useCurrentUserContext();
  const { signIn } = useConnectionContext();
  const afterLoggedInTarget = useAfterLoggedInTarget();

  useEffect(
    () =>
      setPageMetadata(formatMessage(metadata.title), {
        img: metadata.img,
        description: formatMessage(metadata.description),
      }),
    [setPageMetadata, formatMessage, metadata]
  );

  useEffect(() => {
    if (!currentUser && afterLoggedInTarget) {
      signIn();
    }
  }, [currentUser, afterLoggedInTarget, signIn]);

  if (currentUser) {
    return <Navigate to={loggedInPath} replace />;
  }

  return children;
};

export default LandingFootball;
