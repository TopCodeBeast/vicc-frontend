import cookie from 'react-cookies';

import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useLocationChanged } from '@sorare/core/src/hooks/useLocationChanged';

import { VERSION } from '../../config';
import isOutdated from './isOutdated';
import reloadPage from './reloadPage';

const recentlyUpdatedCookieName = '_sorare_recently_updated';

export const EnsureLatestAppVersion = () => {
  const locationChanged = useLocationChanged();
  const {
    flags: { minimumFrontendVersion },
  } = useFeatureFlags();

  if (!locationChanged || !isOutdated(minimumFrontendVersion)) {
    return null;
  }

  // loop protection, if we do not meet the minimum version we will update every 2-5 minute till we reach it
  if (cookie.load(recentlyUpdatedCookieName)) {
    // eslint-disable-next-line no-console
    console.info(
      `Outdated version (${VERSION} < ${minimumFrontendVersion}), cookie avoiding reload.`
    );
    return null;
  }
  cookie.save(recentlyUpdatedCookieName, Date.now(), {
    maxAge: 120 + Math.floor(Math.random() * 180),
    path: '/',
  });

  // eslint-disable-next-line no-console
  console.info(
    `Outdated version (${VERSION} < ${minimumFrontendVersion}), reloading...`
  );

  reloadPage(minimumFrontendVersion);

  return null;
};
