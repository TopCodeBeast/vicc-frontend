import useQueryString from '@core/hooks/useQueryString';

export const useIsMobileWebView = () => {
  const platformQueryParam = useQueryString('platform');
  return (
    platformQueryParam &&
    ['ios', 'android', 'mobile'].includes(platformQueryParam)
  );
};
