import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, generatePath, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import RarityGradientBackground from '@sorare/core/src/atoms/layout/RarityGradientBackground';
import { Text14, Text16, Title4 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import {
  FOOTBALL_HOME,
  FOOTBALL_LOBBY,
  FOOTBALL_USER_GALLERY_OVERVIEW,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSeoContext } from '@sorare/core/src/contexts/seo';
import useRedirectToLogIn from '@sorare/core/src/hooks/auth/useRedirectToLogIn';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { lineupPositions } from '@sorare/core/src/lib/players';
import MultiSportAppBar from '@sorare/core/src/routing/MultiSportAppBar';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Field from '@football/components/composeTeam/Field';
import { LineupDate } from '@football/components/lineup/LineupDate';
import CaptainToggle from '@football/components/so5/ComposeTeam/responsive/CaptainToggle';
import { useFootballEvents } from '@football/lib/events';
import { getAppearancesByPosition } from '@football/lib/so5';

import {
  LineupSharingQuery,
  LineupSharingQueryVariables,
} from './__generated__/index.graphql';

const Root = styled(RarityGradientBackground)`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: var(--100vh);
  overflow: scroll;
  @media ${laptopAndAbove} {
    &:before {
      position: fixed;
      inset: 0;
      content: '';
      background: linear-gradient(
          to left,
          rgba(var(--c-static-rgb-neutral-1000), 0.8) 0%,
          rgba(var(--c-static-rgb-neutral-1000), 0) 20%
        ),
        linear-gradient(
          to right,
          rgba(var(--c-static-rgb-neutral-1000), 0.8) 0%,
          rgba(var(--c-static-rgb-neutral-1000), 0) 20%
        );
    }
  }
`;
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Header = styled.div`
  display: grid;
  grid-template-areas:
    'logo name'
    'logo date';
  grid-template-columns: min-content 1fr;
  column-gap: var(--unit);
  align-items: center;
`;
const Logo = styled.img`
  grid-area: logo;
  width: 40px;
  height: 40px;
  justify-self: flex-end;
`;
const LeaderboardName = styled(Title4)`
  grid-area: name;
  text-align: left;
`;
const Date = styled.div`
  grid-area: date;
  text-align: left;
`;
const Manager = styled(Link)`
  grid-area: nickname;
  display: flex;
  align-items: center;
  margin: auto;
  gap: var(--unit);
  background-color: rgba(var(--c-rgb-neutral-1000), 0.1);
  border-radius: var(--double-unit);
  padding: 2px var(--unit);
  margin-top: var(--double-unit);
  &,
  &:hover,
  &:focus,
  &:active {
    color: var(--c-neutral-1000);
  }
`;
const UserImage = styled.img`
  width: 16px;
  height: 16px;
  border-radius: var(--unit);
`;
const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  justify-content: center;
  align-items: center;
`;
const Lineup = styled.div`
  position: relative;
  isolation: isolate;
  flex: 1;
`;
const Background = styled.img`
  position: fixed;
  z-index: -1;
  inset: 0;
  object-fit: cover;
  height: 100%;
  width: 100%;
  opacity: 0.1;
`;
const Captain = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-40%, -40%);
  z-index: 2;
`;

const LINEUP_SHARING_QUERY = gql`
  query LineupSharingQuery($id: ID!) {
    football {
      vicc5 {
        vicc5Lineup(id: $id) {
          id
          vicc5Appearances {
            id
            captain
            card {
              slug
              assetId
              position: positionTyped
              rarity
              pictureUrl: pictureUrl(derivative: "tinified")
              player {
                slug
                displayName
              }
            }
          }
          vicc5Leaderboard {
            slug
            displayName
            rarityType
            svgLogoUrl
          }
          vicc5Fixture {
            slug
            startDate
            ...LineupDate_fixture
          }
          socialPictureUrls {
            post
            square
            story
          }
          user {
            slug
            nickname
            profile {
              id
              pictureUrl
            }
          }
        }
      }
    }
  }
  ${LineupDate.fragments.fixture}
` as TypedDocumentNode<LineupSharingQuery, LineupSharingQueryVariables>;

const LineupSharing = () => {
  const { currentUser } = useCurrentUserContext();
  const redirectToLogIn = useRedirectToLogIn();
  const { setPageMetadata } = useSeoContext();
  const track = useFootballEvents();
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const { data } = useQuery(LINEUP_SHARING_QUERY, {
    variables: {
      id: id!,
      vicc5LeaderboardSlug: null,
    },
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      const img =
        data.football.vicc5.vicc5Lineup.socialPictureUrls?.post ||
        data.football.vicc5.vicc5Lineup.socialPictureUrls?.square ||
        data.football.vicc5.vicc5Lineup.socialPictureUrls?.story ||
        undefined;

      setPageMetadata(
        formatMessage(
          {
            id: 'LineUpSharing.title',
            defaultMessage: "{nickname}'s Lineup",
          },
          { nickname: data.football.vicc5.vicc5Lineup.user?.nickname }
        ),
        { img }
      );
      if (data.football.vicc5.vicc5Lineup.vicc5Leaderboard) {
        track('View Shared Lineup', {
          lineup: data?.football.vicc5.vicc5Lineup.id,
          competition: data.football.vicc5.vicc5Lineup.vicc5Leaderboard.displayName,
        });
      }
    }
  }, [
    formatMessage,
    setPageMetadata,
    track,
    data,
    currentUser,
    redirectToLogIn,
  ]);

  if (!data) return null;

  const { vicc5Appearances, vicc5Leaderboard, vicc5Fixture, user } =
    data.football.vicc5.vicc5Lineup;
  const lineup = getAppearancesByPosition(vicc5Appearances);

  return (
    <Root rarity={vicc5Leaderboard?.rarityType} withRarityText>
      <MultiSportAppBar color={!currentUser ? 'transparent' : undefined} />
      <Background src={`${FRONTEND_ASSET_HOST}/fields/fallback.jpg`} alt="" />
      <Lineup style={{ '--delay': '0s' } as any}>
        <Field
          title={
            <HeaderWrapper>
              <Header>
                <Logo src={vicc5Leaderboard?.svgLogoUrl} />
                <Date>
                  <LineupDate fixture={vicc5Fixture} />
                </Date>
                <LeaderboardName>{vicc5Leaderboard?.displayName}</LeaderboardName>
              </Header>
              <Manager
                to={generatePath(FOOTBALL_USER_GALLERY_OVERVIEW, {
                  slug: user.slug,
                })}
              >
                <UserImage src={user.profile.pictureUrl || undefined} />
                <Text14>{user.nickname}</Text14>
              </Manager>
            </HeaderWrapper>
          }
          render={({ Card }) =>
            lineupPositions.map(position => {
              const item = lineup[position];
              return (
                <Card key={position} noPointerEvents>
                  {item.captain && (
                    <Captain>
                      <CaptainToggle
                        disablePositioning
                        active
                        disableAnimation
                      />
                    </Captain>
                  )}
                  <CardImg
                    src={item.card.pictureUrl ?? undefined}
                    width={160}
                    alt=""
                  />
                </Card>
              );
            })
          }
          confirm={() => (
            <FlexContainer>
              <Button component={Link} to={FOOTBALL_LOBBY} color="blue" medium>
                <FormattedMessage
                  id="LineupSharing.Cta.completeLineup"
                  defaultMessage="Complete your lineup"
                />
              </Button>
              <Link to={FOOTBALL_HOME}>
                <Text16 bold color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="LineupSharing.Cta.goBackHome"
                    defaultMessage="Go back to home"
                  />
                </Text16>
              </Link>
            </FlexContainer>
          )}
        />
      </Lineup>
    </Root>
  );
};

export default LineupSharing;
