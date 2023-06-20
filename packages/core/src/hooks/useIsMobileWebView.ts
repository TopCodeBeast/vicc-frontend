import useQueryString from '@sorare/core/src/hooks/useQueryString';

export const useIsMobileWebView = () => {
  const platformQueryParam = useQueryString('platform');
  return (
    platformQueryParam &&
    ['ios', 'android', 'mobile'].includes(platformQueryParam)
  );
};
