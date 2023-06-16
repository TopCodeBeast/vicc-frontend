export const isStaging = ENV === 'staging';
export const isMockprod = ENV === 'mockprod';
export const isProduction = ENV === 'production';

export const API_ROOT = envConfig.backendHost;
export const LAUNCH_DARKLY_CLIENT_SIDE_ID = '';

export const CLIENT_TYPE = 'Web';
export const REVISION = import.meta.env?.VITE_COMMIT_REF || 'development';
export const TAB_VERSION = format(new Date(), 'yyyyMMddHHmmss');
export const VERSION =
  REVISION === 'development' || import.meta.env.MODE === 'development'
    ? TAB_VERSION
    : Number(import.meta.env.VITE_TIMESTAMP_VERSION);

