import { generatePath } from 'react-router-dom';

import { FOOTBALL_USER_GALLERY_NETWORK } from '@sorare/core/src/constants/routes';

export default (user: { slug: string }) => {
  const base = FOOTBALL_USER_GALLERY_NETWORK;

  return (tab: 'followers' | 'following' | 'recommended') =>
    generatePath(`${base}?tab=${tab}`, { slug: user.slug });
};
