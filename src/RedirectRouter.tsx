import {
  Navigate,
  Route,
  Routes,
  generatePath,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  FOOTBALL_HOME,
  FOOTBALL_MANAGER_HOME_CARDS,
  FOOTBALL_MANAGER_HOME_CARD_COLLECTIONS,
  FOOTBALL_MANAGER_HOME_CLUB_HONORS,
  FOOTBALL_MANAGER_HOME_NETWORK,
  FOOTBALL_MANAGER_HOME_SQUADS,
  FOOTBALL_USER_GALLERY_CARDS,
  FOOTBALL_USER_GALLERY_CARD_COLLECTIONS,
  FOOTBALL_USER_GALLERY_CLUB_HONORS,
  FOOTBALL_USER_GALLERY_CUSTOM_DECKS,
  FOOTBALL_USER_GALLERY_NETWORK,
  FOOTBALL_USER_GALLERY_SQUADS,
  FOOTBALL_USER_GALLERY_WILDCARD,
  MY_GALLERY_WILDCARD,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useGetSplat from '@sorare/core/src/hooks/useGetSplat';

const RedirectRouter = () => {
  const { currentUser } = useCurrentUserContext();
  const location = useLocation();
  const getSplat = useGetSplat();
  const { slug } = useParams();

  return (
    <Routes>
      {[
        ...(currentUser
          ? [
              {
                from: MY_GALLERY_WILDCARD,
                to: getSplat(
                  MY_GALLERY_WILDCARD,
                  generatePath(FOOTBALL_USER_GALLERY_WILDCARD, {
                    slug: currentUser.slug,
                  })
                ),
              },
              {
                from: FOOTBALL_MANAGER_HOME_CARDS,
                to: generatePath(FOOTBALL_USER_GALLERY_CARDS, {
                  slug: currentUser.slug,
                }),
              },
              {
                from: FOOTBALL_MANAGER_HOME_CARD_COLLECTIONS,
                to: generatePath(FOOTBALL_USER_GALLERY_CARD_COLLECTIONS, {
                  slug: currentUser.slug,
                }),
              },
              {
                from: FOOTBALL_MANAGER_HOME_SQUADS,
                to: generatePath(FOOTBALL_USER_GALLERY_SQUADS, {
                  slug: currentUser.slug,
                }),
              },
              {
                from: FOOTBALL_MANAGER_HOME_CLUB_HONORS,
                to: generatePath(FOOTBALL_USER_GALLERY_CLUB_HONORS, {
                  slug: currentUser.slug,
                }),
              },
              {
                from: FOOTBALL_MANAGER_HOME_NETWORK,
                to: generatePath(FOOTBALL_USER_GALLERY_NETWORK, {
                  slug: currentUser.slug,
                }),
              },
            ]
          : []),
        {
          from: FOOTBALL_USER_GALLERY_CUSTOM_DECKS,
          to: slug
            ? generatePath(FOOTBALL_USER_GALLERY_SQUADS, { slug })
            : FOOTBALL_HOME,
        },
      ].map(({ from, to }) => (
        <Route
          key={from}
          path={from}
          element={<Navigate to={to + location.search} replace />}
        />
      ))}
      <Route path="*" element={null} />
    </Routes>
  );
};

export default RedirectRouter;
