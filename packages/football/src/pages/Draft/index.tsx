import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import {
  Navigate,
  generatePath,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { animated, useTrail } from '@react-spring/web';
import styled from 'styled-components';

import {
  CommonDraftCampaignStatus,
  Position,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import ErrorBoundary from '@sorare/core/src/components/ErrorBoundary';
import { Empty } from '@sorare/core/src/components/cards/Empty';
import { STADIUM_ANIMATION } from '@sorare/core/src/constants/assets';
import {
  FOOTBALL_COMPOSE_TEAM,
  FOOTBALL_COMPOSE_TEAM_DRAFT,
  FOOTBALL_DRAFT,
  LANDING,
} from '@sorare/core/src/constants/routes';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { OneTimeDialog } from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import { Level } from '@sorare/core/src/contexts/snackNotification';
import SnackNotification from '@sorare/core/src/contexts/snackNotification/SnackNotification';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';
import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';
import usePrevious from '@sorare/core/src/hooks/usePrevious';
import { glossary } from '@sorare/core/src/lib/glossary';
import {
  desktopAndAbove,
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import Drawer from '@football/components/composeTeam/Drawer';
import { DraftHeader } from '@football/components/draft/DraftHeader';
import PositionTabs from '@football/components/searchCards/PositionTabs';
import PlayerDetails from '@football/components/so5/ComposeTeam/responsive/PlayerDetails';
import { useActiveOnboarding } from '@football/hooks/onboarding/useActiveOnboarding';
import useNavigateToComposeTeam from '@football/hooks/so5/useNavigateToComposeTeam';
import { useFootballEvents } from '@football/lib/events';
import Card from '@football/pages/Draft/Card';
import DraftFilters from '@football/pages/Draft/DraftFilters';
import { Picker } from '@football/pages/Draft/Picker';
import useUpsertDraft from '@football/pages/Draft/Picker/useUpsertDraft';
import { RouteState } from '@football/types/routes';

import useFiltersReducer from './DraftFilters/useFiltersReducer';
import MaxPlayerPerTeamDialog from './MaxPlayerPerTeamDialog';
import { Onboarding } from './Onboarding';
import { DraftQuery, DraftSetupQuery } from './__generated__/queries.graphql';
import { useAutoFillQuery, useDraftQuery, useSetupQuery } from './queries';
import useDraftReducer, {
  Draft as DraftType,
  Player as DraftablePlayer,
} from './useDraftReducer';

type DraftQuery_vicc5Leaderboard_commonDraftCampaign_availablePlayers_nodes =
  NonNullable<
    DraftQuery['football']['vicc5']['vicc5Leaderboard']['commonDraftCampaign']
  >['availablePlayers']['nodes'][number];

type DraftSetupQuery_vicc5Leaderboard_commonDraftCampaign = NonNullable<
  DraftSetupQuery['football']['vicc5']['vicc5Leaderboard']['commonDraftCampaign']
>;

const PAGE_SIZE = 20;

const Root = styled.section`
  display: flex;
  isolation: isolate;
  flex-direction: column;
  height: var(--100vh);
  overflow: hidden;
  position: relative;
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;
const ContentWithDetails = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  max-width: 100%;
`;
const ScrollableContent = styled.div`
  flex: 1;
  overflow: auto;
  isolation: isolate;
`;
const DrawerWrapper = styled.div`
  overflow: auto;
  height: 100%;
  box-shadow: 0 0 var(--quadruple-unit) rgba(var(--c-rgb-neutral-100), 0.03);
`;
const PositionPicker = styled(Picker)`
  margin-top: auto;
  flex-shrink: 0;
`;
const StickyWrapper = styled.div<{ showBackButton: boolean }>`
  position: sticky;
  top: -48px; /* arbitrary value to hide most of the header but still keep a bit of it visible to have a bit of "padding" */
  @media ${tabletAndAbove} {
    top: ${({ showBackButton }) => (showBackButton ? '-132px' : '-88px')};
  }
  z-index: 1;
`;
const FiltersWrapper = styled(Container)`
  background-color: var(--c-neutral-100);
  padding-bottom: var(--unit);
`;
const ContainerWrapper = styled(Container)`
  overflow: hidden;
  @media ${tabletAndAbove} {
    row-gap: var(--quadruple-unit);
  }
  @media ${laptopAndAbove} {
    padding: 0 calc(50px + var(--unit)) calc(50px + var(--unit));
  }
`;
const Cards = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--unit);
  padding-bottom: var(--unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: var(--double-unit);
  }
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;
const Notification = styled(SnackNotification)`
  @media ${tabletAndAbove} {
    top: 176px;
  }
  @media ${desktopAndAbove} {
    top: 120px;
  }
`;
const draftErrorCodes = {
  maxPlayerPerTeam: 21002,
};

const SlideInCards = ({
  remove,
  add,
  cards,
  selected,
  reset,
  openedPlayerSlug,
  togglePlayerDetails,
}: {
  cards: DraftQuery_vicc5Leaderboard_commonDraftCampaign_availablePlayers_nodes[];
  remove: (playerId: string) => void;
  add: (
    player: DraftQuery_vicc5Leaderboard_commonDraftCampaign_availablePlayers_nodes
  ) => void;
  selected: string[];
  reset?: boolean;
  togglePlayerDetails: (args: {
    slug: string;
    pictureUrl: string;
    card: DraftQuery_vicc5Leaderboard_commonDraftCampaign_availablePlayers_nodes;
  }) => void;
  openedPlayerSlug?: string;
}) => {
  const trail = useTrail(cards?.length, {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    reset,
    config: { mass: 1, tension: 250, friction: 25 },
  });

  return (
    <>
      {trail.map((style, index) => {
        const item = cards[index];
        return (
          <animated.div style={style} key={item.id}>
            <Card
              selected={selected.includes(item.id)}
              highlighted={openedPlayerSlug === item.player.slug}
              draftablePlayer={item}
              remove={() => {
                remove(item.id);
              }}
              add={() => {
                add(item);
              }}
              togglePlayerDetails={e => {
                e.stopPropagation();
                togglePlayerDetails({
                  slug: item.player.slug,
                  pictureUrl: item.pictureUrl,
                  card: item,
                });
              }}
            />
          </animated.div>
        );
      })}
    </>
  );
};

type Props = {
  vicc5LeaderboardSlug: string;
  commonDraftCampaign: DraftSetupQuery_vicc5Leaderboard_commonDraftCampaign;
};
const Draft = ({ vicc5LeaderboardSlug, commonDraftCampaign }: Props) => {
  const {
    positions,
    budget,
    slug: commonDraftCampaignSlug,
    status,
    teams,
    draftedPlayers,
    maxDraftablePlayerValue,
  } = commonDraftCampaign;
  const boundariesRange = { min: 0, max: maxDraftablePlayerValue };

  const { currentUser } = useCurrentUserContext();
  const isActiveOnboarding = useActiveOnboarding();
  // Storing the initial value of isActiveOnboarding because it will change once the draft is submitted, but in the context of this page we are still in the onboarding
  const [isOnboarding] = useState(isActiveOnboarding);
  const { updateQuery } = useConfigContext();
  const [searchParams] = useSearchParams();
  const track = useFootballEvents();
  const [filtersState, filtersDispatch] = useFiltersReducer({
    boundariesRange,
  });
  const [playerDetails, setPlayerDetails] = useState<{
    slug: string;
    pictureUrl: string | null;
    budgetValue: number;
    id: string;
  } | null>(null);

  const [submiting, setSubmiting] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { upsertDraft } = useUpsertDraft();
  const [storedDraft, setStoredDraft, clearStoredDraft] = useLocalStorage(
    vicc5LeaderboardSlug,
    [] as DraftType
  );
  const [
    { draft, activePosition, selectedPlayersInError, errorMessage, errorCode },
    dispatch,
  ] = useDraftReducer(positions, storedDraft, draftedPlayers, filtersDispatch);
  const currentPosition = draft[activePosition]?.position;
  const prevPosition = usePrevious(currentPosition);

  const location = useLocation();
  const locationState = location.state as RouteState[typeof FOOTBALL_DRAFT];

  useEffect(() => {
    track('Start Draft', {
      campaignSlug: commonDraftCampaignSlug,
      sourcePage: locationState?.sourcePage,
      isLogged: !!currentUser,
      isOnboarding,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // No dependency added because we want it to be called only once

  const isWebviewFromNativeApp = searchParams.get('deeplink');
  const showExitCta = !isWebviewFromNativeApp && !isOnboarding;

  const selectedPrintablePlayerIds = draft
    .map(d => d.drafted?.id)
    .filter(Boolean);
  const playerDetailsIsSelected =
    playerDetails && selectedPrintablePlayerIds.includes(playerDetails.id);

  const variables = useMemo(
    () => ({
      vicc5LeaderboardSlug,
      position: currentPosition || Position.Unknown,
      pageSize: PAGE_SIZE,
      selectedPrintablePlayerIds,
      ...filtersState.appliedFilters,
    }),
    // we explicitly ignore selectedPrintablePlayerIds to prevent useless reloading when on same position
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vicc5LeaderboardSlug, currentPosition, filtersState.appliedFilters]
  );
  const {
    data: { availablePlayers, pageInfo },
    loading,
    loadMore,
  } = useDraftQuery(variables);
  const [loadAutoFill, { loading: loadingAutoFill }] = useAutoFillQuery({
    vicc5LeaderboardSlug,
    onCompleted: autoPick => {
      dispatch({ type: 'autoFill', payload: autoPick });
    },
  });
  const autoPick = useCallback(() => {
    loadAutoFill({
      variables: {
        vicc5LeaderboardSlug,
        selectedPrintablePlayerIds,
      },
    });
  }, [selectedPrintablePlayerIds, loadAutoFill, vicc5LeaderboardSlug]);
  const dryUpsert = useCallback(
    (ids: string[]) => {
      upsertDraft({
        variables: {
          input: {
            vicc5LeaderboardSlug,
            force: status === CommonDraftCampaignStatus.REDRAFTABLE,
            commonDraftCampaignSlug,
            printablePlayerIds: ids,
            dryRun: true,
          },
        },
      }).then(({ data }) => {
        if (data?.upsertCommonDraft?.draftError) {
          dispatch({
            type: 'error',
            payload: data.upsertCommonDraft.draftError,
          });
        } else {
          dispatch({
            type: 'nextPosition',
          });
        }
      });
    },
    [dispatch, upsertDraft, status, commonDraftCampaignSlug, vicc5LeaderboardSlug]
  );
  const navigate = useNavigate();
  const navigateToComposeTeam = useNavigateToComposeTeam();
  const generatePathWithSearch = useGeneratePathWithSearch();
  const [seenMaxPlayerPerTeamDialog, setSeenMaxPlayerPerTeamDialog] =
    useState(false);

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, { ...variables, after: pageInfo?.endCursor });
    }, [loadMore, variables, pageInfo?.endCursor]),
    Boolean(pageInfo?.hasNextPage),
    loading,
    '1000px'
  );

  const selectedInvalidPlayers = draft.filter(
    ({ drafted }) => !!drafted && selectedPlayersInError.includes(drafted.id)
  );

  const showMaxPlayerPerTeamDialog =
    errorCode === draftErrorCodes.maxPlayerPerTeam &&
    !seenMaxPlayerPerTeamDialog;

  const onCloseMaxPlayer = () => {
    setSeenMaxPlayerPerTeamDialog(true);
    dispatch({ type: 'closeError' });
  };
  const removePlayer = (id: string) => {
    dispatch({ type: 'removePlayer', payload: id });
    dryUpsert(selectedPrintablePlayerIds.filter(playerId => playerId !== id));
  };
  const addPlayer = (draftablePlayer: DraftablePlayer) => {
    dispatch({
      type: 'addPlayer',
      payload: draftablePlayer,
    });
    dryUpsert(
      draft
        .map((draftedPosition, i) => {
          if (i === activePosition) {
            return draftablePlayer.id;
          }
          return draftedPosition.drafted?.id;
        })
        .filter(Boolean)
    );
  };
  const submit = async () => {
    if (draft.some(({ drafted }) => !drafted)) return;

    setSubmiting(true);
    const { data: upsertData } = await upsertDraft({
      variables: {
        input: {
          vicc5LeaderboardSlug,
          force: status === CommonDraftCampaignStatus.REDRAFTABLE,
          commonDraftCampaignSlug,
          printablePlayerIds: selectedPrintablePlayerIds,
          dryRun: !currentUser?.slug,
        },
      },
    });

    track('Click Submit Draft', {
      campaignSlug: commonDraftCampaignSlug,
      success: !upsertData?.upsertCommonDraft?.draftError,
      errorMessage: upsertData?.upsertCommonDraft?.draftError?.error,
      isLogged: !!currentUser,
      isOnboarding,
    });

    if (upsertData?.upsertCommonDraft?.draftError) {
      dispatch({
        type: 'error',
        payload: upsertData.upsertCommonDraft.draftError,
      });
    } else if (currentUser?.slug && !isOnboarding) {
      navigateToComposeTeam({
        leaderboardSlug: vicc5LeaderboardSlug,
        options: {
          state: {
            context: 'postDraft',
          },
        },
      });
    } else if (currentUser?.slug) {
      const newOnboardingStatus =
        upsertData?.upsertCommonDraft?.currentUser?.onboardingStatus;

      if (newOnboardingStatus) {
        /* update the onboarding status of currentUser in ConfigQuery.
        This ensures that the onboarding status is always up to date without having to wait to be notified by the subscription on CurrentUser */
        updateQuery({
          ...currentUser,
          onboardingStatus: newOnboardingStatus,
        });
      }
      navigate(
        generatePathWithSearch(FOOTBALL_COMPOSE_TEAM, {
          vicc5LeaderboardSlug,
        }),
        {
          state: {
            context: 'onboarding',
          },
        }
      );
    } else {
      setStoredDraft(draft);
      navigate(
        generatePath(FOOTBALL_COMPOSE_TEAM_DRAFT, {
          slug: vicc5LeaderboardSlug,
        })
      );
    }
    setSubmiting(false);
  };

  return (
    <ErrorBoundary
      onCatch={e => {
        if (storedDraft) {
          clearStoredDraft();
          window.location.reload();
        } else {
          throw e;
        }
      }}
    >
      {({ error }) =>
        error ? null : (
          <Root ref={headerRef} className="dark-theme">
            <Helmet>
              <link rel="preload" as="video" href={STADIUM_ANIMATION} />
            </Helmet>
            <ContentWithDetails>
              <Content>
                <ScrollableContent>
                  <StickyWrapper showBackButton={showExitCta}>
                    <DraftHeader
                      commonDraftCampaign={commonDraftCampaign}
                      showExitCta={showExitCta}
                      isOnboarding={isOnboarding}
                    />
                    <FiltersWrapper>
                      <DraftFilters
                        state={filtersState}
                        dispatch={filtersDispatch}
                        teams={teams}
                        currentPosition={currentPosition}
                      >
                        {positions.length && (
                          <PositionTabs
                            positions={[...new Set(positions)]}
                            currentPosition={currentPosition}
                            onClick={position =>
                              dispatch({
                                type: 'changeSelectedPositionType',
                                payload: position,
                              })
                            }
                          />
                        )}
                      </DraftFilters>
                    </FiltersWrapper>
                  </StickyWrapper>
                  <ContainerWrapper>
                    {errorMessage && !showMaxPlayerPerTeamDialog && (
                      <Notification
                        onClose={() => dispatch({ type: 'closeError' })}
                        notification={errorMessage}
                        opts={{
                          level: Level.WARN,
                          autoHideDuration: null,
                        }}
                      />
                    )}
                    {showMaxPlayerPerTeamDialog && (
                      <MaxPlayerPerTeamDialog
                        onClose={onCloseMaxPlayer}
                        selectedInvalidPlayers={selectedInvalidPlayers}
                      />
                    )}
                    <Cards>
                      <SlideInCards
                        reset={currentPosition !== prevPosition}
                        cards={availablePlayers}
                        selected={selectedPrintablePlayerIds}
                        openedPlayerSlug={playerDetails?.slug}
                        remove={removePlayer}
                        togglePlayerDetails={({ slug, pictureUrl, card }) => {
                          setPlayerDetails(prevPlayerDetails =>
                            prevPlayerDetails?.slug === slug
                              ? null
                              : {
                                  slug,
                                  pictureUrl,
                                  id: card.id,
                                  budgetValue: card.value,
                                }
                          );
                        }}
                        add={addPlayer}
                      />
                    </Cards>
                    {!loading && availablePlayers?.length === 0 && (
                      <Empty
                        title={
                          <FormattedMessage
                            id="Draft.noResults.title"
                            defaultMessage="No players found"
                          />
                        }
                        description={
                          <FormattedMessage
                            id="Draft.noResults.description"
                            defaultMessage="We didn't find any players matching your search"
                          />
                        }
                      />
                    )}
                    <InfiniteScrollLoader />
                  </ContainerWrapper>
                  <OneTimeDialog dialogId={LIFECYCLE.sawDraftTuto}>
                    {({ onClose, open }) => (
                      <Onboarding
                        isOpen={open}
                        budget={budget}
                        commonDraftCampaign={commonDraftCampaign}
                        onClose={onClose}
                      />
                    )}
                  </OneTimeDialog>
                </ScrollableContent>
                <PositionPicker
                  onSelect={selected =>
                    dispatch({
                      type: 'changeSelectedPosition',
                      payload: selected,
                    })
                  }
                  draft={draft}
                  draftError={selectedPlayersInError}
                  activePosition={activePosition}
                  clear={() => {
                    dispatch({ type: 'clear' });
                  }}
                  budget={budget}
                  remove={removePlayer}
                  autoFill={autoPick}
                  loading={{ autofill: loadingAutoFill, submit: submiting }}
                  submit={() => {
                    submit();
                  }}
                />
              </Content>
              <DrawerWrapper>
                <Drawer open={!!playerDetails}>
                  {!!playerDetails?.slug && (
                    <div className="dark-theme">
                      <PlayerDetails
                        slug={playerDetails?.slug}
                        pictureUrl={playerDetails?.pictureUrl}
                        onClose={() => {
                          setPlayerDetails(null);
                        }}
                        budgetValue={playerDetails?.budgetValue}
                        extraActions={
                          <Button
                            color={playerDetailsIsSelected ? 'red' : 'blue'}
                            small
                            onClick={() => {
                              const payload = availablePlayers.find(
                                ({ player }) =>
                                  player.slug === playerDetails.slug
                              );
                              if (playerDetailsIsSelected) {
                                removePlayer(playerDetails.id);
                              } else if (payload) {
                                addPlayer(payload);
                              }
                            }}
                          >
                            {playerDetailsIsSelected ? (
                              <FormattedMessage {...glossary.remove} />
                            ) : (
                              <FormattedMessage {...glossary.select} />
                            )}
                          </Button>
                        }
                      />
                    </div>
                  )}
                </Drawer>
              </DrawerWrapper>
            </ContentWithDetails>
          </Root>
        )
      }
    </ErrorBoundary>
  );
};

const DraftOrRedirect = () => {
  const { slug } = useParams();
  const { data, loading } = useSetupQuery(slug);

  if (loading)
    return (
      <div className="dark-theme">
        <LoadingIndicator fullScreen />
      </div>
    );
  if (!slug || !data?.vicc5.vicc5Leaderboard.commonDraftCampaign) {
    return <Navigate to={LANDING} />;
  }

  return (
    <Draft
      vicc5LeaderboardSlug={slug}
      commonDraftCampaign={data.vicc5.vicc5Leaderboard.commonDraftCampaign}
    />
  );
};

export default DraftOrRedirect;
