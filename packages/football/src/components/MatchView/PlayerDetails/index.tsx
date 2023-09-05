import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text18 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_PLAYER_SHOW } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { desktopAndAbove } from '@sorare/core/src/style/mediaQuery';

import PlayerAvatar from '@football/components/player/PlayerAvatar';
import DetailedScoreV4V5 from '@football/components/stats/DetailedScore/DetailedScoreV4V5';

import {
  MatchViewPlayerDetailsQuery,
  MatchViewPlayerDetailsQueryVariables,
} from './__generated__/index.graphql';

type MatchViewPlayerDetailsQuery_player =
  MatchViewPlayerDetailsQuery['football']['player'];

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  padding: var(--double-unit) 0 0;
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  .dark-theme & {
    background-color: var(--c-neutral-200);
  }
  /* The minimum width not to break the detailed score table layout */
  min-width: 250px;
  height: 100%;
`;
const CloseButtonWrapper = styled.div`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
  @media ${desktopAndAbove} {
    display: none;
  }
`;
const PlayerOverview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--unit);
`;
const DetailedScoreWrapper = styled.div`
  overflow: auto;
`;
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const MATCH_VIEW_PLAYER_SCORE_QUERY = gql`
  query MatchViewPlayerDetailsQuery($slug: String!, $id: ID!) {
    football {
      player(slug: $slug) {
        slug
        displayName
        avatarPictureUrl: pictureUrl(derivative: "avatar")
        vicc5Score(gameId: $id) {
          ...DetailedScoreV4V5_vicc5Score
        }
      }
    }
  }
  ${DetailedScoreV4V5.fragments.vicc5Score}
` as TypedDocumentNode<
  MatchViewPlayerDetailsQuery,
  MatchViewPlayerDetailsQueryVariables
>;

type Props = { slug?: string; gameId?: string; onClose: () => void };
const PlayerDetails = ({ slug, gameId, onClose }: Props) => {
  const [currentSelectedPlayer, setCurrentSelectedPlayer] =
    useState<MatchViewPlayerDetailsQuery_player | null>(null);
  const { data, loading } = useQuery(MATCH_VIEW_PLAYER_SCORE_QUERY, {
    variables: {
      slug: slug!,
      id: gameId!,
    },
    skip: !gameId || !slug,
  });

  if (data?.football.player && data.football.player !== currentSelectedPlayer) {
    setCurrentSelectedPlayer(data.football.player);
  }

  return (
    <Root>
      {loading && !currentSelectedPlayer ? (
        <LoaderContainer>
          <LoadingIndicator small />
        </LoaderContainer>
      ) : (
        currentSelectedPlayer && (
          <>
            <CloseButtonWrapper>
              <CloseButton onClose={onClose} />
            </CloseButtonWrapper>
            <PlayerOverview>
              <PlayerAvatar player={currentSelectedPlayer} />
              <Link
                to={generatePath(FOOTBALL_PLAYER_SHOW, {
                  slug: currentSelectedPlayer.slug,
                })}
              >
                <Text18>{currentSelectedPlayer.displayName}</Text18>
              </Link>
            </PlayerOverview>
            <DetailedScoreWrapper>
              {currentSelectedPlayer.vicc5Score && (
                <DetailedScoreV4V5
                  vicc5Score={currentSelectedPlayer.vicc5Score}
                  withDetails
                />
              )}
            </DetailedScoreWrapper>
          </>
        )
      )}
    </Root>
  );
};

export default PlayerDetails;
