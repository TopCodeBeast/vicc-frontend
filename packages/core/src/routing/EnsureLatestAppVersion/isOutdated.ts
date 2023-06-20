import { VERSION } from '../../config';

export const isOutdated = (minimumFrontendVersion?: string) => {
  return minimumFrontendVersion && VERSION < Number(minimumFrontendVersion);
};

export default isOutdated;
