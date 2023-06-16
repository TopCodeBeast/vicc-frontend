import { format } from 'date-fns';
export const isStaging = false;
export const isMockprod = false;
export const isProduction = false;

export const API_ROOT = 'http://localhost:8000';
export const LAUNCH_DARKLY_CLIENT_SIDE_ID = '';

export const CLIENT_TYPE = 'Web';
export const REVISION = import.meta.env?.VITE_COMMIT_REF || 'development';
export const TAB_VERSION = format(new Date(), 'yyyyMMddHHmmss');
export const VERSION =
  REVISION === 'development' || import.meta.env.MODE === 'development'
    ? TAB_VERSION
    : Number(import.meta.env.VITE_TIMESTAMP_VERSION);

