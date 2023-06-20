import { HttpLink } from '@apollo/client';

export const httpLink = (uri: string) => {
  return new HttpLink({
    uri,
    credentials: 'include',
  });
};
