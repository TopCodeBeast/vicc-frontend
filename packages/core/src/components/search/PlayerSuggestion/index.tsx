import { PlayerHit } from '@sorare/core/src/lib/algolia';

import Suggestion from '../Suggestion';

interface Props {
  hit: PlayerHit;
  isHighlighted: boolean;
}

export const PlayerSuggestion = ({ hit, isHighlighted }: Props) => {
  return (
    <Suggestion
      isHighlighted={isHighlighted}
      renderAvatar={Img => <Img src={hit.avatarUrl} alt={hit.display_name} />}
      primary={hit.display_name}
      secondary={hit.activeClub ? hit.activeClub.name : ''}
    />
  );
};

export default PlayerSuggestion;
