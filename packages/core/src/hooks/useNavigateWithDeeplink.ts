import {
  NavigateOptions,
  To,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

const useNavigateWithDeeplink = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const navigateWithDeeplink = (
    path: To | number,
    options?: NavigateOptions
  ) => {
    const deeplink = searchParams.get('deeplink') || '';

    if (/^sorare:\/\//.test(deeplink)) {
      window.location.href = decodeURIComponent(deeplink);
    } else {
      navigate(path as any, options);
    }
  };

  return navigateWithDeeplink;
};

export default useNavigateWithDeeplink;
