import qs from 'qs';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useUpdateQueryString = <T = string>() => {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (newValues: { [key: string]: T | undefined }) => {
      const currentQueryString = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      const search = qs.stringify(
        {
          ...currentQueryString,
          ...newValues,
        },
        { addQueryPrefix: true }
      );
      navigate(
        {
          ...location,
          search,
        },
        { replace: true, state: location.state }
      );
    },
    [location, navigate]
  );
};

export default useUpdateQueryString;
