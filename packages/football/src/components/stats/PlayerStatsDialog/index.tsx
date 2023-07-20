import { gql } from '@apollo/client';
import styled from 'styled-components';

import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';

import PlayerGameScorePage from '@football/components/stats/PlayerGameScorePage';
import useTitle from '@football/components/stats/PlayerGameScorePage/useTitle';

type Props = {
  open: boolean;
  onClose: () => void;
  gameWeek?: number;
} & PlayerStatsDialogContentsProps;

type PlayerGameScorePageProps = React.ComponentProps<
  typeof PlayerGameScorePage
>;

type LoadedContentProps = {
  so5Score: PlayerGameScorePageProps['so5Score'];
  player: PlayerGameScorePageProps['player'];
  team: PlayerGameScorePageProps['team'];
  representativePlayer?: PlayerGameScorePageProps['representativePlayer'];
};

type LoadingContentsProps = Record<string, unknown>;

type PlayerStatsDialogContentsProps = {
  loading: boolean;
} & Partial<LoadedContentProps> &
  (
    | ({ loading: true } & LoadingContentsProps)
    | ({ loading: false } & LoadedContentProps)
  );

const isLoadingContentProps = (
  props: PlayerStatsDialogContentsProps
): props is { loading: true } & LoadingContentsProps => props.loading;

const Loading = styled.div`
  margin: 20px 0px;
`;

const PlayerStatsDialogContents = (props: PlayerStatsDialogContentsProps) => {
  if (isLoadingContentProps(props)) {
    return (
      <Loading>
        <LoadingIndicator />
      </Loading>
    );
  }
  const { player, so5Score, team, representativePlayer } = props;
  return (
    <PlayerGameScorePage
      so5Score={so5Score}
      team={team}
      player={player}
      representativePlayer={representativePlayer}
    />
  );
};

export const PlayerStatsDialog = ({
  onClose,
  open,
  gameWeek,
  ...contentProps
}: Props) => {
  const title = useTitle(gameWeek);

  return (
    <Dialog open={open} title={title} onClose={onClose} hideScrollBar noMargin>
      <PlayerStatsDialogContents {...contentProps} />
    </Dialog>
  );
};

PlayerStatsDialog.fragments = {
  so5Score: gql`
    fragment PlayerStatsDialog_so5Score on So5Score {
      id
      ...PlayerGameScorePage_so5Score
    }
    ${PlayerGameScorePage.fragments.so5Score}
  `,
  player: gql`
    fragment PlayerStatsDialog_player on Player {
      slug
      ...PlayerGameScorePage_player
    }
    ${PlayerGameScorePage.fragments.player}
  `,
  representativePlayer: gql`
    fragment PlayerStatsDialog_representativePlayer on Player {
      slug
      ...PlayerGameScorePage_representativePlayer
    }
    ${PlayerGameScorePage.fragments.representativePlayer}
  `,
};

export default PlayerStatsDialog;
