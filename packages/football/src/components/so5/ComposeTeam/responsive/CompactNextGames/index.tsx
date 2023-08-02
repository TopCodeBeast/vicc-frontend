import { TypedDocumentNode, gql } from '@apollo/client';

import GameCompactInfo from '@football/components/composeTeam/GameCompactInfo';
import { ContextProvider_so5Lineup } from '@football/components/so5/ComposeTeam/ContextProvider/__generated__/index.graphql';

import { CompactNextGames_card } from './__generated__/index.graphql';

type Props = {
  card:
    | CompactNextGames_card
    | ContextProvider_so5Lineup['so5Appearances'][number]['card'];
};

export const CompactNextGames = ({ card }: Props) => {
  const { player } = card;

  const playerTeamSlug = player.activeClub?.slug;
  const { gamesForLeaderboard } = player;

  return (
    <GameCompactInfo
      games={gamesForLeaderboard}
      playerTeamSlug={playerTeamSlug}
    />
  );
};

CompactNextGames.fragments = {
  card: gql`
    fragment CompactNextGames_card on Card {
      slug
      assetId
      player {
        slug
        activeClub {
          slug
        }
        gamesForLeaderboard(so5LeaderboardSlug: $so5LeaderboardSlug) {
          id
          ...GameCompactInfo_game
        }
      }
    }
    ${GameCompactInfo.fragments.game}
  ` as TypedDocumentNode<CompactNextGames_card>,
};

export default CompactNextGames;
