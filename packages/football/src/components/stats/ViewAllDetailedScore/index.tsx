import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { Text16 } from '@sorare/core/src/atoms/typography';
import useToggle from '@sorare/core/src/hooks/useToggle';

import PlayerGameScoreDialog from '@football/components/stats/PlayerGameScoreDialog';

import {
  ViewAllDetailedScore_player,
  ViewAllDetailedScore_vicc5Score,
} from './__generated__/index.graphql';

type Props = {
  vicc5Score: ViewAllDetailedScore_vicc5Score;
  player?: ViewAllDetailedScore_player;
};

export const ViewAllDetailedScore = ({ vicc5Score, player }: Props) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <div>
      <ButtonBase disableRipple onClick={toggleOpen}>
        <Text16 bold>
          <FormattedMessage
            id="ViewAllDetailedScore.viewAll"
            defaultMessage="View all stats"
          />
        </Text16>
      </ButtonBase>
      <PlayerGameScoreDialog
        vicc5ScoreId={vicc5Score.id}
        player={player}
        onClose={toggleOpen}
        open={open}
      />
    </div>
  );
};

ViewAllDetailedScore.fragments = {
  vicc5Score: gql`
    fragment ViewAllDetailedScore_vicc5Score on Vicc5Score {
      id
    }
  ` as TypedDocumentNode<ViewAllDetailedScore_vicc5Score>,
  player: gql`
    fragment ViewAllDetailedScore_player on Player {
      slug
      ...PlayerGameScoreDialogQuery_player
    }
    ${PlayerGameScoreDialog.fragments.player}
  ` as TypedDocumentNode<ViewAllDetailedScore_player>,
};

export default ViewAllDetailedScore;
