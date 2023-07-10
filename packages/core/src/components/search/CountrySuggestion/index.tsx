import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { CountryHit } from '@core/lib/algolia';

import Suggestion from '../Suggestion';

interface Props {
  hit: CountryHit;
  isHighlighted: boolean;
}

export const CountrySuggestion = ({ hit, isHighlighted }: Props) => (
  <Suggestion
    isHighlighted={isHighlighted}
    renderAvatar={Img => (
      <Img
        src={`${FRONTEND_ASSET_HOST}/flags/${hit.code}.svg`}
        alt={hit.code}
      />
    )}
    primary={hit.name_en}
  />
);

export default CountrySuggestion;
