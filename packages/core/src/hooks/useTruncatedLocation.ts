import { useLocation } from 'react-router-dom';

export default () => {
  const location = useLocation();

  if (location.search.length > 500) {
    return location.pathname;
  }

  return `${location.pathname}${location.search}`;
};
