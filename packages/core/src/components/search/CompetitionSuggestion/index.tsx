import { CompetitionHit } from '@core/lib/algolia';

import Suggestion from '../Suggestion';

interface Props {
  hit: CompetitionHit;
  isHighlighted: boolean;
}

export const CompetitionSuggestion = ({ hit, isHighlighted }: Props) => {
  return (
    <Suggestion
      isHighlighted={isHighlighted}
      renderAvatar={Img => (
        <Img src={hit.pictureUrl} alt={hit.display_name} isContain />
      )}
      primary={hit.display_name}
    />
  );
};

export default CompetitionSuggestion;
