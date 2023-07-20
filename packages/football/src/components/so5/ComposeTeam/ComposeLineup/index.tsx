import { gql } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { AveragePlayerScore } from '@sorare/core/src/__generated__/globalTypes';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { useOneTimeDialogContext } from '@sorare/core/src/contexts/oneTimeDialog';
import { OneTimeDialog } from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';
import { LineupPosition, lineupPositions } from '@sorare/core/src/lib/players';

import DumbComposeTeam from '@football/components/composeTeam';
import CapBar from '@football/components/composeTeam/Bench/Field/CapBar';
import Header from '@football/components/composeTeam/Header';
import LineupHeader from '@football/components/composeTeam/LineupHeader';
import { ComposeOnboarding } from '@football/components/onboarding/ComposeOnboarding';
import AverageScore from '@football/components/so5/AverageScore';
import Context from '@football/components/so5/ComposeTeam/Context';
import Appearance from '@football/components/so5/ComposeTeam/responsive/Appearance';
import BenchCards from '@football/components/so5/ComposeTeam/responsive/BenchCards';
import BenchFilter from '@football/components/so5/ComposeTeam/responsive/BenchFilter';
import CaptainDialog from '@football/components/so5/ComposeTeam/responsive/CaptainDialog';
import ConfirmButton from '@football/components/so5/ComposeTeam/responsive/ConfirmButton';
import PlayerDetails from '@football/components/so5/ComposeTeam/responsive/PlayerDetails';
import Requirements from '@football/components/so5/ComposeTeam/responsive/Requirements';
import useShortcut from '@football/hooks/useShortcut';
import { getTitleMessage } from '@football/lib/composeLineup';

const PlayerScoreWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(-1 * var(--intermediate-unit));
  display: flex;
  justify-content: center;
`;

const ComposeLineup = () => {
  const {
    so5Leaderboard,
    so5Lineup,
    lineup,
    setActivePosition,
    activePosition,
    onClose,
    benchOpen,
    setBenchOpen,
    lineupComplete,
    showFilters,
    needCaptain,
    initialLineupCards,
    captain,
    isCappedMode,
    displayedAverageScore,
    toggleCaptain,
    playerDetails,
    setPlayerDetails,
    removeCard,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useContext(Context)!;
  const { up: isLaptop } = useScreenSize('laptop');
  const { sawDialog } = useOneTimeDialogContext();
  const [isEdit, setIsEdit] = useState(!!initialLineupCards.length);
  const totalFifteenAverageScore = useMemo(
    () =>
      Object.values(lineup).reduce((acc, cur) => {
        return (cur.card?.lastFifteenVicc5AverageScore || 0) + acc;
      }, 0),
    [lineup]
  );

  useShortcut('1', () => setActivePosition(lineupPositions[3]));
  useShortcut('2', () => setActivePosition(lineupPositions[4]));
  useShortcut('3', () => setActivePosition(lineupPositions[1]));
  useShortcut('4', () => setActivePosition(lineupPositions[0]));
  useShortcut('5', () => setActivePosition(lineupPositions[2]));

  const fifteenGameAverageTotalLimit = so5Leaderboard.rules?.sumOfAverageScores;
  const isCaptainStep = lineupComplete && needCaptain && !captain;
  const isConfirmStep = lineupComplete && !isCaptainStep;
  const titleMessage = getTitleMessage(isCaptainStep, isConfirmStep, isEdit);
  const stall =
    !!so5Leaderboard.commonDraftCampaign?.slug &&
    !sawDialog(LIFECYCLE.sawComposeOnboarding);
  const onCardSelect = (position: LineupPosition) => {
    setIsEdit(false);
    if (isCaptainStep) {
      toggleCaptain(position);
    } else {
      setBenchOpen(true);
    }
  };
  const renderBenchField = ({ Card, CardPlaceholder }: any) => {
    return Object.entries(lineup).map(([position, { card }]) => {
      return (
        <Card key={position} selected={position === activePosition}>
          {card?.avatarPictureUrl ? (
            <CardImg
              onClick={() => setActivePosition(position as LineupPosition)}
              src={card.avatarPictureUrl}
              alt=""
              width={160}
            />
          ) : (
            <CardPlaceholder
              onClick={() => setActivePosition(position as LineupPosition)}
              selected={position === activePosition}
              position={position as LineupPosition}
            />
          )}
          {typeof card?.lastFifteenVicc5AverageScore === 'number' && (
            <PlayerScoreWrapper>
              <AverageScore
                capped={isCappedMode}
                score={
                  card?.[
                    displayedAverageScore ===
                    AveragePlayerScore.LAST_FIVE_VICC5_AVERAGE_SCORE
                      ? 'lastFiveSo5AverageScore'
                      : 'lastFifteenVicc5AverageScore'
                  ]
                }
                withTooltip
                size="smaller"
                scoreMode={
                  displayedAverageScore ===
                  AveragePlayerScore.LAST_FIVE_VICC5_AVERAGE_SCORE
                    ? 'AVERAGE_LAST_5_GAMES'
                    : 'AVERAGE_LAST_15_GAMES'
                }
              />
            </PlayerScoreWrapper>
          )}
        </Card>
      );
    });
  };

  return (
    <>
      <DumbComposeTeam
        disableAnimation={so5Leaderboard.trainingCenter}
        stall={stall}
        header={
          <Header
            so5Leaderboard={so5Leaderboard}
            so5Lineup={so5Lineup}
            Back={({ children }) => (
              <button type="button" onClick={onClose}>
                {children}
              </button>
            )}
          />
        }
        lineupHeader={
          <LineupHeader
            Back={({ children }) => (
              <button type="button" onClick={onClose}>
                {children}
              </button>
            )}
            renderExtra={Extra => {
              return (
                <Extra>
                  <Requirements />
                </Extra>
              );
            }}
          />
        }
        bench={Bench => (
          <Bench
            open={benchOpen}
            render={({ Container, Field }) => {
              const field = Field && (
                <Field
                  capBar={
                    fifteenGameAverageTotalLimit ? (
                      <CapBar
                        used={totalFifteenAverageScore}
                        cap={fifteenGameAverageTotalLimit}
                        nbEmptySlots={
                          5 - Object.values(lineup).filter(a => !!a.card).length
                        }
                      />
                    ) : undefined
                  }
                  render={renderBenchField}
                  lineupComplete={lineupComplete}
                  confirm={({ ConfirmButton: Confirm }) => (
                    <Confirm
                      lineupComplete={lineupComplete}
                      onClick={() => {
                        setBenchOpen(false);
                      }}
                    >
                      <FormattedMessage
                        id="So5.ComposeTeam.Compose"
                        defaultMessage="Compose your lineup"
                      />
                    </Confirm>
                  )}
                />
              );
              return (
                <>
                  <Container>
                    {((isLaptop && field) || showFilters) && (
                      <>
                        {isLaptop && field}
                        {showFilters && <BenchFilter />}
                      </>
                    )}
                    <BenchCards />
                  </Container>
                  {!isLaptop && field}
                </>
              );
            }}
          />
        )}
        lineup={Field => (
          <Field
            title={<FormattedMessage {...titleMessage} />}
            render={({ Card, CardPlaceholder }) => {
              return lineupPositions.map((position, index) => {
                const card = lineup[position]?.card;
                return (
                  <Card
                    key={position}
                    selected={position === activePosition}
                    onRemove={card ? () => removeCard(position) : undefined}
                  >
                    {card ? (
                      <Appearance
                        item={lineup[position]}
                        index={index}
                        position={position}
                        key={position}
                        onSelect={() => {
                          if (playerDetails) {
                            setPlayerDetails({
                              slug: card.player.slug,
                              pictureUrl: card.pictureUrl,
                              card,
                            });
                          }
                          onCardSelect(position);
                        }}
                      />
                    ) : (
                      <CardPlaceholder
                        onClick={() => {
                          setActivePosition(position);
                          setBenchOpen(true);
                          setIsDrawerOpen(false);
                        }}
                        position={position}
                        selected={position === activePosition}
                      />
                    )}
                  </Card>
                );
              });
            }}
            confirm={({ CtaWrapper }) => (
              <CtaWrapper>
                <ConfirmButton />
              </CtaWrapper>
            )}
          />
        )}
        drawer={Drawer => (
          <Drawer open={isDrawerOpen}>
            {playerDetails ? (
              <div className="dark-theme">
                <PlayerDetails
                  slug={playerDetails.slug}
                  pictureUrl={playerDetails.pictureUrl || ''}
                  card={playerDetails.card}
                  onClose={() => setIsDrawerOpen(false)}
                />
              </div>
            ) : null}
          </Drawer>
        )}
      />
      <OneTimeDialog
        dialogId={LIFECYCLE.sawComposeOnboarding}
        show={!!so5Leaderboard.commonDraftCampaign?.slug}
      >
        {({ onClose: onDialogClose, open }) => (
          <ComposeOnboarding
            isOpen={open}
            competition={so5Leaderboard.commonDraftCampaign?.competitions[0]}
            onClose={onDialogClose}
          />
        )}
      </OneTimeDialog>
      <CaptainDialog />
    </>
  );
};

ComposeLineup.fragments = {
  so5Leaderboard: gql`
    fragment ComposeLineup_so5Leaderboard on Vicc5Leaderboard {
      slug
      rules {
        id
        sumOfAverageScores
      }
      trainingCenter
      so5League: vicc5League {
        slug
        name
      }
      commonDraftCampaign {
        slug
        competitions {
          slug
          id
          ...ComposeOnboarding_competition
        }
      }
      ...ComposeTeamDraftHeader_so5Leaderboard
    }
    ${Header.fragments.so5Leaderboard}
    ${ComposeOnboarding.fragments.competition}
  `,
  so5Lineup: gql`
    fragment ComposeLineup_so5Lineup on Vicc5Lineup {
      id
      so5Appearances: vicc5Appearances {
        id
        ...Appearance_so5Appearance
        card {
          slug
          assetId
          ...BenchCards_card
        }
      }
    }
    ${Appearance.fragments.so5_appearance}
    ${BenchCards.fragments.card}
  `,
};

export default ComposeLineup;
