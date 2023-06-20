import { API_ROOT } from '../config';
import { load } from './http';

export const getSalt = async (email: string) => {
  const { salt } = await load<{ salt: string }>(
    `${API_ROOT}/api/v1/users/${email}`,
    true
  );
  return salt;
};
