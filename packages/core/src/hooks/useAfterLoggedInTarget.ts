import { useLocation } from 'react-router-dom';

export default () => {
  const location: any = useLocation();
  if (typeof location.state === 'object' && location.state) {
    return location.state.afterLoggedInTarget;
  }
  return null;
};
