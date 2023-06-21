import { FRONTEND_ASSET_HOST } from '@core/constants/assets';

import countryCodes from './country_codes.json';
import enSubdivisions from './subdivisions_en.json';
import enTerritories from './territories_en.json';

export const toDisplayName = (code: string) =>
  enTerritories[code.toUpperCase() as keyof typeof enTerritories] ||
  enSubdivisions[code.replace('-', '') as keyof typeof enSubdivisions] ||
  code;

export const toThreeLettersCountryCode = (code: string) =>
  countryCodes[code.toUpperCase() as keyof typeof countryCodes] || code;

const SPECIAL_FLAGS: { [key: string]: string } = {
  'gb-eng': '_england',
  'gb-sct': '_scotland',
  'gb-wls': '_wales',
  'gb-nir': '_northern_ireland',
};

export type FlagType = 'flat' | 'round';

const toCodeForFlag = (code: string) =>
  SPECIAL_FLAGS[code] || code.toUpperCase();

export const flagUrl = ({
  country,
  type = 'round',
  size = 64,
}: {
  country: { slug: string } | null;
  type?: FlagType;
  size?: number;
}) =>
  `${FRONTEND_ASSET_HOST}/flags-iso/${type}/${size}/${
    country ? toCodeForFlag(country.slug) : '_united-nations'
  }.png`;
