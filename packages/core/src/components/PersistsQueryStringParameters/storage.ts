import { local as localStorage } from '@sorare/core/src/lib/storage';

export const keys: { [index in QSKey]: LSKey } = {
  referrer: 'REFERRER',
  irclickid: 'IMPACT_CLICKID',
  invitation_token: 'INVITATION_TOKEN',
  utm_source: 'UTM_SOURCE',
  utm_medium: 'UTM_MEDIUM',
  utm_campaign: 'UTM_CAMPAIGN',
  utm_term: 'UTM_TERM',
  utm_content: 'UTM_CONTENT',
  traffic_category: 'TRAFFIC_CATEGORY',
  partner: 'PARTNER',
  user: 'USER',
};
export type QSKey =
  | 'referrer'
  | 'irclickid'
  | 'invitation_token'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
  | 'traffic_category'
  | 'partner'
  | 'user';

export type LSKey =
  | 'REFERRER'
  | 'IMPACT_CLICKID'
  | 'INVITATION_TOKEN'
  | 'UTM_SOURCE'
  | 'UTM_MEDIUM'
  | 'UTM_CAMPAIGN'
  | 'UTM_TERM'
  | 'UTM_CONTENT'
  | 'CUSTOM_PROFILE_ID'
  | 'TRAFFIC_CATEGORY'
  | 'PARTNER'
  | 'USER';
interface Storage {
  get: (key: LSKey) => string | null;
  set: (key: LSKey, value?: string) => void;
}

const localStorageFactory: () => Storage = () => {
  return {
    get: localStorage.getItem,
    set: (key, value) => {
      if (value) {
        localStorage.setItem(key, value);
      }
    },
  };
};

const data: Partial<Record<LSKey, string>> = {};
const objectStorageFactory = (): Storage => {
  return {
    get: key => data[key] || null,
    set: (key, value) => {
      if (value) {
        data[key] = value;
      }
    },
  };
};

export const storageFactory: () => Storage = () => {
  if (localStorage) {
    return localStorageFactory();
  }
  return objectStorageFactory();
};

export const getValue = (key: QSKey) => {
  return storageFactory().get(keys[key]);
};
