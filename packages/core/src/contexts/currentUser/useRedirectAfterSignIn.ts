import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FOOTBALL_HOME,
  FOOTBALL_MARKET,
  MLB_HOME,
  NBA_HOME,
  // useDefaultSportPages,
} from '@core/constants/routes';
import { useConfigContext } from '@core/contexts/config';
import useAfterLoggedInTarget from '@core/hooks/useAfterLoggedInTarget';
import { Lifecycle } from '@core/hooks/useLifecycle';
import { useRedirectUrl } from '@core/hooks/useRedirectUrl';

import { SignInMutation } from './__generated__/queries.graphql';

type SignInMutation_signIn_currentUser = NonNullable<
  NonNullable<SignInMutation['signIn']>['currentUser']
>;

export default () => {
  const redirectUrl = useRedirectUrl();
  const afterLoggedInTarget = useAfterLoggedInTarget();
  const { landingTheme } = useConfigContext();
  const sportTarget = landingTheme?.sport;
  const navigate = useNavigate();
  // const defaultSportPages = useDefaultSportPages();

  return useCallback(
    (currentUser: SignInMutation_signIn_currentUser | null) => {
      const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
      const lastVisitedSport = lifecycle?.lastVisitedSport;

      /*const fromPath =
        redirectUrl ||
        currentUser?.fromPath ||
        afterLoggedInTarget ||
        (sportTarget && defaultSportPages[sportTarget]) ||
        (lastVisitedSport && defaultSportPages[lastVisitedSport]);*/

      if (currentUser) {
        /*if (fromPath) {
          // make sure we don't redirect to an external URL as it would be a security issue.
          const url = new URL(fromPath, window.location.origin);
          navigate(`${url.pathname}${url.search}`, {
            state: { afterLoggedInTarget: null },
            replace: true,
          });
        } else {
          const onboardedOnFootball = currentUser.footballProfile?.onboarded;
          const onboardedOnMLB = currentUser.baseballProfile?.onboarded;
          const onboardedOnNBA = currentUser.nbaProfile?.onboarded;

          // if the user is onboarded on at least 2 sports (or none of them),
          // we don't redirect and show the Choose your Sport page

          const onboardedOnOnlyOneSport =
            [onboardedOnFootball, onboardedOnMLB, onboardedOnNBA].filter(
              Boolean
            ).length === 1;

          // But if the user is onboarded on only 1 sport,
          // we should skip the Choose your sport page and send them there directly
          if (onboardedOnOnlyOneSport) {
            if (onboardedOnMLB) {
              navigate(MLB_HOME);
            } else if (onboardedOnNBA) {
              navigate(NBA_HOME);
            }
            navigate(FOOTBALL_MARKET);
          }
        }*/

        //TODO****
        console.log('RedirectAfterSignIn')
        navigate(FOOTBALL_HOME);//navigate(FOOTBALL_MARKET);
      }
    },
    [redirectUrl, afterLoggedInTarget, sportTarget, /*defaultSportPages,*/ navigate]
  );
};
