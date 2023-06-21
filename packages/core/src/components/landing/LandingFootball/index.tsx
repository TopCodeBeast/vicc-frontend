import { ReactElement, useEffect } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useConnectionContext } from '@core/contexts/connection';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSeoContext } from '@core/contexts/seo';
import useAfterLoggedInTarget from '@core/hooks/useAfterLoggedInTarget';

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
