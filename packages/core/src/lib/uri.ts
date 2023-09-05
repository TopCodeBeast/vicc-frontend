// Allow only Vicc URL
export const sanitizeRedirectUrl = (uri: string) =>
  /^https:\/\/sorare\.(dev|com|tech|co|fr)\//.test(uri) ? uri : undefined;

export const isValidUrl = (uri: string | undefined) => {
  if (!uri) {
    return false;
  }
  try {
    // eslint-disable-next-line no-new
    new URL(uri);

    return true;
  } catch (e) {
    return false;
  }
};
