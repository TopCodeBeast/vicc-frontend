import { Params, generatePath, useLocation } from 'react-router-dom';

export const useGeneratePathWithSearch = () => {
  const location = useLocation();

  return (path: string, params?: Params) => {
    return generatePath(`${path}${location.search}`, params);
  };
};
