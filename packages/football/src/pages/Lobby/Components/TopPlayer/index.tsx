import { TypedDocumentNode, gql } from '@apollo/client';
import qs from 'qs';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Blockquote from '@sorare/core/src/atoms/layout/Blockquote';
import Container from '@sorare/core/src/atoms/layout/Container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { SecondaryTabs } from '@sorare/core/src/atoms/navigation/SecondaryTabs';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { Text16 } from '@sorare/core/src/atoms/typography';
import DumbPlayerAvatar from '@sorare/core/src/components/player/DumbPlayerAvatar';
import { goToLobby } from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import { useQueryStrings } from '@sorare/core/src/hooks/useQueryStrings';
import { playablePositions, positionNames } from '@sorare/core/src/lib/players';

import PlayerGameScoreDialog from '@football/components/stats/PlayerGameScoreDialog';
import PlayerScore from '@football/components/stats/PlayerScore';
import { getPlayerScore } from '@football/lib/so5';

import {
  LobbyTopPlayersPerPositionQuery,
  LobbyTopPlayersPerPositionQueryVariables,
} from './__generated__/index.graphql';

interface Props {
  vicc5Fixture?: { slug: string } | null;
  live?: boolean;
}

const Root = styled.footer`
  padding: var(--double-unit) 0;
`;
const PositionTabs = styled(SecondaryTabs)`
  --link: var(--c-neutral-1000);
  --linkBg: var(--c-neutral-100);
  --activeLinkBorder: var(--c-neutral-1000);
  --activeLink: var(--c-neutral-1000);
  --activeLinkBg: var(--c-neutral-100);
  margin-bottom: var(--unit);
`;
const PlayerPictureWrapper = styled.div`
  position: relative;
`;
const PlayerAvatar = styled(DumbPlayerAvatar)`
  aspect-ratio: 32/40;
  width: 40px;
  height: auto;
  border-radius: var(--half-unit);
  padding: 0 var(--half-unit);
  object-fit: contain;
  background-color: var(--c-neutral-300);
`;
const RepresentativePlayerAvatar = styled(DumbPlayerAvatar)`
  position: absolute;
  right: -2px;
  background-color: var(--c-neutral-300);
  border-radius: 50%;
  bottom: -2px;
  width: 22px;
  height: 22px;
  object-fit: contain;
`;
const PlayersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const PlayerButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  background: transparent;
  gap: var(--unit);
  padding: var(--unit);
  border-radius: var(--unit);
  background-color: var(--c-neutral-200);
  &:hover,
  &:focus {
    background: var(--c-neutral-300);
    ${PlayerAvatar}, ${RepresentativePlayerAvatar} {
      background-color: rgba(var(--c-rgb-neutral-400), 0.2);
    }
  }
`;
const PlayerInfoWrapper = styled.div`
  margin-right: auto;
  text-align: left;
`;
const Footer = styled.footer`
  margin-top: var(--double-unit);
  text-align: center;
`;

export const LOBBY_TOP_PLAYERS_PER_POSITION_QUERY = gql`
  query LobbyTopPlayersPerPositionQuery(
    $slug: String
    $position: Position!
    $cursor: String
  ) {
    #football {
      vicc5 {
        vicc5Fixture(slug: $slug) {
          slug
          orderedVicc5Scores(first: 1) {
            position
            vicc5Scores {
              id
            }
          }
          orderedVicc5ScoresByPosition(
            position: $position
            minScore: 1
            after: $cursor
            first: 10
          ) {
            nodes {
              id
              score
              player {
                slug
                displayName
                avatarPictureUrl: pictureUrl(derivative: "avatar")
              }
              playerGameStats {
                id
                team {
                  ... on Club {
                    slug
                    name
                  }
                  ... on NationalTeam {
                    slug
                    name
                  }
                }
                player {
                  slug
                  displayName
                  avatarPictureUrl: pictureUrl(derivative: "avatar")
                }
              }
              ...getPlayerScore_vicc5Score
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    #}
  }
  ${getPlayerScore.fragments.vicc5Score}
` as TypedDocumentNode<
  LobbyTopPlayersPerPositionQuery,
  LobbyTopPlayersPerPositionQueryVariables
>;

export const TopPlayers = ({ vicc5Fixture }: Props) => {
  const { formatMessage } = useIntl();
  const [openPlayerGameScore, setOpenPlayerGameScore] = useState('');
  const sortedPlayablePosition = [...playablePositions].reverse();
  let { position } = useQueryStrings({
    position: sortedPlayablePosition[0],
  });

  if (!sortedPlayablePosition.includes(position)) {
    [position] = sortedPlayablePosition;
  }
  const { loading, data, loadMore } = usePaginatedQuery(
    LOBBY_TOP_PLAYERS_PER_POSITION_QUERY,
    {
      variables: {
        slug: vicc5Fixture?.slug,
        position,
      },
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
      connection: 'Vicc5ScoreConnection',
      skip: !vicc5Fixture?.slug,
    }
  );
  const fixture = data?.vicc5.vicc5Fixture;
  const hasScores = !!fixture?.orderedVicc5Scores.find(
    ({ vicc5Scores }) => vicc5Scores.length
  );

  const orderedVicc5ScoresByPosition = fixture?.orderedVicc5ScoresByPosition;
  const { pageInfo, nodes } = orderedVicc5ScoresByPosition || {};
  const cursor = pageInfo?.endCursor;

  const loadMoreCallback = useCallback(() => {
    loadMore(false, {
      position,
      cursor,
    });
  }, [position, loadMore, cursor]);

  if (!hasScores) {
    return null;
  }

  return (
    <Root>
      <Container>
        <StyledSecondaryTabs
          noBorder
          items={[
            {
              to: goToLobby('live'),
              label: formatMessage({
                id: 'TopPlayers.title',
                defaultMessage: 'Top players',
              }),
              active: true,
            },
          ]}
        />
        <PositionTabs
          noBorder
          items={sortedPlayablePosition.map(pos => ({
            to: qs.stringify(
              {
                ...qs.parse(window.location.search, {
                  ignoreQueryPrefix: true,
                }),
                position: pos,
              },
              { addQueryPrefix: true }
            ),
            label: formatMessage(positionNames[pos]),
            active: !position || position === pos,
          }))}
        />
        {nodes?.length ? (
          <>
            <PlayersWrapper>
              {nodes.map(vicc5Score => {
                const {
                  player,
                  playerGameStats: { player: representativePlayer, team },
                } = vicc5Score;
                const { score, status } = getPlayerScore(vicc5Score);
                const isIrlScore = representativePlayer.slug === player.slug;
                return (
                  <PlayerButton
                    key={vicc5Score.id}
                    type="button"
                    onClick={() => setOpenPlayerGameScore(vicc5Score.id)}
                  >
                    {isIrlScore ? (
                      <PlayerAvatar
                        name={player.displayName}
                        avatarUrl={player.avatarPictureUrl}
                      />
                    ) : (
                      <PlayerPictureWrapper>
                        <PlayerAvatar
                          name={player.displayName}
                          avatarUrl={player.avatarPictureUrl}
                        />
                        <RepresentativePlayerAvatar
                          name={representativePlayer.displayName}
                          avatarUrl={representativePlayer.avatarPictureUrl}
                          variant="medallion"
                        />
                      </PlayerPictureWrapper>
                    )}
                    <PlayerInfoWrapper>
                      <Text16 bold>{player.displayName}</Text16>
                      <Text16>{team.name}</Text16>
                    </PlayerInfoWrapper>
                    <PlayerScore score={score} status={status} />
                  </PlayerButton>
                );
              })}
            </PlayersWrapper>
            {pageInfo?.hasNextPage && (
              <Footer>
                <Button color="black" stroke medium onClick={loadMoreCallback}>
                  <FormattedMessage
                    id="Lobby.TopPlayer.showMore"
                    defaultMessage="Show more players"
                  />
                </Button>
              </Footer>
            )}
            <PlayerGameScoreDialog
              vicc5ScoreId={idFromObject(openPlayerGameScore)!}
              onClose={() => setOpenPlayerGameScore('')}
              open={!!openPlayerGameScore}
            />
          </>
        ) : (
          <div>
            {loading ? (
              <LoadingIndicator fullHeight />
            ) : (
              <Blockquote variant="grey">
                <FormattedMessage
                  id="Lobby.TopPlayers.noResults"
                  defaultMessage="Nobody has played yet. Come back later!"
                />
              </Blockquote>
            )}
          </div>
        )}
      </Container>
    </Root>
  );
};
