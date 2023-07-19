import { useLocation } from 'react-router-dom';

const useGetSplat = () => {
  const location = useLocation();
  return (from: string, to: string) => {
    const oldPathBase = from.replace('/*', '');
    const pathBase = to.replace('/*', '');
    return `${pathBase}${location?.pathname.replace(oldPathBase, '')}`;
  };
};

export default useGetSplat;
