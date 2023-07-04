import { StoreObject, defaultDataIdFromObject } from '@apollo/client';

const idFromObject = <T extends Nullable<string>>(relayId: T): T => {
  return relayId?.split(':').slice(-1)[0] as T;
};
export default idFromObject;

export const dataIdFromObject = (object: StoreObject) => {
  const { slug, assetId, startYear, transactionHash, id, __typename } = object;

  const defaultId = (() => {
    if (
      __typename === 'BaseballCard' ||
      __typename === 'NBACard' ||
      __typename === 'Token'
    ) {
      return assetId || id;
    }
    if (__typename === 'Card') {
      return assetId || slug;
    }
    if (__typename === 'TokenPrimaryOffer') {
      return idFromObject(id as string);
    }
    return slug || startYear || transactionHash;
  })();
  if (defaultId) {
    return `${__typename}:${defaultId}`;
  }

  return defaultDataIdFromObject(object);
};
