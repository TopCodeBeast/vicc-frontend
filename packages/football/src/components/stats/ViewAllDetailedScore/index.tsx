import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { Text16 } from '@sorare/core/src/atoms/typography';
import useToggle from '@sorare/core/src/hooks/useToggle';

import PlayerGameScoreDialog from '@sorare/football/src/components/stats/PlayerGameScoreDialog';

import {
  ViewAllDetailedScore_player,
  ViewAllDetailedScore_so5Score,
} from './__generated__/index.graphql';

type Props = {
  so5Score: ViewAllDetailedScore_so5Score;
  player?: ViewAllDetailedScore_player;
};

export const ViewAllDetailedScore = ({ so5Score, player }: Props) => {
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
        so5ScoreId={so5Score.id}
        player={player}
        onClose={toggleOpen}
        open={open}
      />
    </div>
  );
};

ViewAllDetailedScore.fragments = {
  so5Score: gql`
    fragment ViewAllDetailedScore_so5Score on So5Score {
      id
    }
  `,
  player: gql`
    fragment ViewAllDetailedScore_player on Player {
      slug
      ...PlayerGameScoreDialogQuery_player
    }
    ${PlayerGameScoreDialog.fragments.player}
  `,
};

export default ViewAllDetailedScore;
