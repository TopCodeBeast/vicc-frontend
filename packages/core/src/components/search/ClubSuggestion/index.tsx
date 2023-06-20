import { ClubHit } from '@sorare/core/src/lib/algolia';

import Suggestion from '../Suggestion';

interface Props {
  hit: ClubHit;
  isHighlighted: boolean;
}

export const ClubSuggestion = ({ hit, isHighlighted }: Props) => {
  return (
    <Suggestion
      isHighlighted={isHighlighted}
      renderAvatar={Img => (
        <Img src={hit.pictureUrl} alt={hit.name} isContain />
      )}
      primary={hit.name}
    />
  );
};

export default ClubSuggestion;
