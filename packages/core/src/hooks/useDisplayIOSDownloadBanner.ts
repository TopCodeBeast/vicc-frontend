import { useEffect } from 'react';

import { useSeoContext } from '@core/contexts/seo';

const useDisplayIOSDownloadBanner = () => {
  const { setIOSDownloadMetadata } = useSeoContext();

  useEffect(() => setIOSDownloadMetadata(), [setIOSDownloadMetadata]);
};

export default useDisplayIOSDownloadBanner;
