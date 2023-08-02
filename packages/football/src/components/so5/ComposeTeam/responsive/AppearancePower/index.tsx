import { TypedDocumentNode, gql } from '@apollo/client';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { Chip } from '@sorare/core/src/atoms/ui/Chip';

import CardBonus from '@football/components/so5/CardProperties/CardBonus';
import Context from '@football/components/so5/ComposeTeam/Context';
import { Position, positionShortNames } from '@football/lib/so5';

import { AppearancePower_card } from './__generated__/index.graphql';

type Props = {
  card?: AppearancePower_card | null;
  position: Position;
  classes?: any;
  captain: boolean;
};

export const AppearancePower = ({ card, position, captain }: Props) => {
  const { so5Leaderboard } = useContext(Context)!;

  if (!card) {
    return null;
  }

  return (
    <>
      <CardBonus
        card={card}
        captain={captain}
        engineConfiguration={so5Leaderboard.engineConfiguration}
      />
      {position === 'Extra Player' && card && (
        <Chip
          color="black"
          size="smaller"
          label={Label => (
            <Label>
              <FormattedMessage {...positionShortNames['Extra Player']} />
            </Label>
          )}
        />
      )}
    </>
  );
};

AppearancePower.fragments = {
  card: gql`
    fragment AppearancePower_card on Card {
      slug
      assetId
      position: positionTyped
      rarity
      ...CardBonus_WithEngine_card
    }
    ${CardBonus.fragments.cardWithEngine}
  ` as TypedDocumentNode<AppearancePower_card>,
};

export default AppearancePower;
