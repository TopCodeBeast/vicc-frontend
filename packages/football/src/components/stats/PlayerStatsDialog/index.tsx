import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { Dialog } from '@sorare/core/src/components/dialog';

import PlayerGameScorePage from '@football/components/stats/PlayerGameScorePage';
import useTitle from '@football/components/stats/PlayerGameScorePage/useTitle';

import {
  PlayerStatsDialog_player,
  PlayerStatsDialog_representativePlayer,
  PlayerStatsDialog_so5Score,
} from './__generated__/index.graphql';

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

const CenteredText16 = styled(Text16)`
  text-align: center;
`;
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
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      title={<CenteredText16 bold>{title}</CenteredText16>}
      onClose={onClose}
      body={<PlayerStatsDialogContents {...contentProps} />}
    />
  );
};

PlayerStatsDialog.fragments = {
  so5Score: gql`
    fragment PlayerStatsDialog_so5Score on So5Score {
      id
      ...PlayerGameScorePage_so5Score
    }
    ${PlayerGameScorePage.fragments.so5Score}
  ` as TypedDocumentNode<PlayerStatsDialog_so5Score>,
  player: gql`
    fragment PlayerStatsDialog_player on Player {
      slug
      ...PlayerGameScorePage_player
    }
    ${PlayerGameScorePage.fragments.player}
  ` as TypedDocumentNode<PlayerStatsDialog_player>,
  representativePlayer: gql`
    fragment PlayerStatsDialog_representativePlayer on Player {
      slug
      ...PlayerGameScorePage_representativePlayer
    }
    ${PlayerGameScorePage.fragments.representativePlayer}
  ` as TypedDocumentNode<PlayerStatsDialog_representativePlayer>,
};

export default PlayerStatsDialog;
