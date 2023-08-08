import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { useCurrentUserContext } from '@core/contexts/currentUser';

const UserGallerySwitch = ({
  children,
  currentUserRender,
}: {
  children: ReactElement;
  currentUserRender: ReactElement;
}) => {
  const { currentUser } = useCurrentUserContext();
  const { slug } = useParams();
  if (slug === currentUser?.slug) return currentUserRender;
  return children;
};

export default UserGallerySwitch;
