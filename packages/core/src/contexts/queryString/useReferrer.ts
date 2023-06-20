import { gql } from '@apollo/client';
import qs from 'qs';
import { useCallback, useEffect } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { keys } from 'components/PersistsQueryStringParameters/storage';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { local as localStorage } from '@sorare/core/src/lib/storage';

import {
  OwnYourGameQuery,
  OwnYourGameQueryVariables,
} from './__generated__/useReferrer.graphql';

const OWN_YOUR_GAME_QUERY = gql`
  query OwnYourGameQuery($name: String!) {
    referrer(name: $name)
  }
`;

const loadReferrerFromLocation = (location: Location) => {
  const pathname = location.pathname.split('/r/');
  if (pathname.length > 1) {
    return pathname[1];
  }
  const { referrer } = qs.parse(location.search.slice(1));
  if (Array.isArray(referrer)) {
    return referrer?.pop()?.toString();
  }
  return referrer?.toString();
};

export default () => {
  const location = useLocation();
  const { landingTheme } = useConfigContext();
  const queryReferrer = loadReferrerFromLocation(location);
  const navigate = useNavigate();
  const removeReferrer = useCallback(() => {
    localStorage.removeItem(keys.referrer);
    if (typeof URLSearchParams !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.has('referrer')) {
        queryParams.delete('referrer');
        navigate(
          {
            search: queryParams.toString(),
          },
          { replace: true }
        );
      }
    }
  }, [navigate]);
  const referrer =
    queryReferrer ||
    localStorage.getItem(keys.referrer) ||
    landingTheme?.userSource?.name;

  const { data, loading } = useQuery<
    OwnYourGameQuery,
    OwnYourGameQueryVariables
  >(OWN_YOUR_GAME_QUERY, {
    variables: { name: referrer! },
    skip: !referrer,
  });

  useEffect(() => {
    if (!loading && data?.referrer)
      localStorage.setItem(keys.referrer, data.referrer);
  }, [loading, data?.referrer]);

  useEffect(() => {
    if (!loading && !data?.referrer && landingTheme?.userSource?.name)
      localStorage.setItem(keys.referrer, landingTheme?.userSource?.name);
  }, [loading, data?.referrer, landingTheme?.userSource?.name]);

  return {
    referrer,
    invalidReferrer: !loading && referrer && !data?.referrer,
    removeReferrer,
  };
};
