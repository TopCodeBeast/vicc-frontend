import { faRepeat, faStore } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { FormattedList, FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import Dialog from '@sorare/core/src/components/dialog';
import { groupBy } from '@sorare/core/src/lib/arrays';
import {
  isMyCardListedOnMarket,
  isSentInDirectOffer,
} from '@sorare/core/src/lib/cards';
import { glossary } from '@sorare/core/src/lib/glossary';
import { formatLineupDisplayName } from '@sorare/core/src/lib/so5';

import Context, {
  ContextProvider_so5Lineup_so5Appearances_card,
} from '@football/components/so5/ComposeTeam/Context';
import {
  ContextProvider_so5Leaderboard,
  ContextProvider_so5Lineup,
} from '@football/components/so5/ComposeTeam/ContextProvider/__generated__/index.graphql';
import DivisionLogo from '@football/components/so5/DivisionLogo';
import { EditableLineup } from '@football/lib/so5';

import { WarningRow } from './WarningRow';

const CenteredText16 = styled(Text16)`
  text-align: center;
`;
const Body = styled.div`
  padding: var(--triple-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Buttons = styled.div`
  display: flex;
  gap: var(--unit);
`;
const WarningRowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const DivisionLogoWrapper = styled.div`
  width: var(--triple-unit);
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Lineup = EditableLineup<ContextProvider_so5Lineup_so5Appearances_card>;

type getUsedCardsParams = {
  lineup: Lineup;
  so5Lineup: ContextProvider_so5Lineup;
  so5Leaderboard: ContextProvider_so5Leaderboard;
};
const getUsedCards = ({
  lineup,
  so5Lineup,
  so5Leaderboard,
}: getUsedCardsParams) => {
  return Object.values(lineup)
    .map(appearance => {
      if (!appearance.card) {
        return null;
      }
      const { openedSo5Lineups } = appearance.card;

      const lineupUsingThisPlayer = openedSo5Lineups.find(openedLineup => {
        return (
          openedLineup.so5Leaderboard?.gameWeek === so5Leaderboard.gameWeek &&
          openedLineup.id !== so5Lineup.id
        );
      });

      if (!lineupUsingThisPlayer) {
        return null;
      }

      return { card: appearance.card, lineupUsingThisPlayer };
    })
    .filter(Boolean);
};

const getSentInDirectOfferCards = (lineup: Lineup) => {
  return Object.values(lineup)
    .filter(
      appearance => !!appearance?.card && isSentInDirectOffer(appearance.card)
    )
    .map(appearance => appearance.card!);
};

const getListedCards = (lineup: Lineup) => {
  return Object.values(lineup)
    .filter(
      appearance =>
        !!appearance?.card && isMyCardListedOnMarket(appearance.card)
    )
    .map(appearance => appearance.card!);
};

export const useHasWarnings = () => {
  const { lineup, so5Lineup, so5Leaderboard } = useContext(Context)!;

  const usedCardsCount = getUsedCards({
    lineup,
    so5Lineup,
    so5Leaderboard,
  }).length;

  const sentInLiveOfferCards = getSentInDirectOfferCards(lineup).length;
  const listedCards = getListedCards(lineup).length;

  return usedCardsCount + sentInLiveOfferCards + listedCards > 0;
};

const messages = defineMessages({
  dialogTitle: {
    id: 'UsedCardsDialog.dialogTitle',
    defaultMessage: 'Warning',
  },
  warningTitle: {
    id: 'ConfirmWarningDialog.warningTitle',
    defaultMessage:
      'You selected {cards, plural, one {a card} other {cards}} that {warnings}',
  },
  usedCards: {
    id: 'ConfirmWarningDialog.warningTitle.usedCards',
    defaultMessage:
      '{cards, plural, one {is in a registered lineup} other {are in registered lineups}}',
  },
  sentInLiveOfferCards: {
    id: 'ConfirmWarningDialog.warningTitle.sentInLiveOfferCards',
    defaultMessage:
      '{cards, plural, one {is sent is a live offer} other {are sent in live offers}}',
  },
  listedCards: {
    id: 'ConfirmWarningDialog.warningTitle.listedCards',
    defaultMessage:
      '{cards, plural, one {is listed in the Marketplace} other {are listed in the Marketplace}}',
  },
  usedInAnotherLineupWarning: {
    id: 'UsedCardsDialog.usedInAnotherLineupWarning',
    defaultMessage:
      'Selecting this player will unregister upcoming <b>{lineupDisplayName}</b> lineup',
  },
  listedWarning: {
    id: 'UsedCardsDialog.listedWarning',
    defaultMessage:
      'Selecting this player will <b>unlist</b> your card from the Marketplace',
  },
  sentInLiveOfferWarning: {
    id: 'UsedCardsDialog.sentInLiveOfferWarning',
    defaultMessage:
      'Selecting this player will <b>cancel</b> ongoing trade offer(s) including this card',
  },
});

type Props = {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
};
export const ConfirmWarningDialog = ({ open, onCancel, onContinue }: Props) => {
  const { lineup, so5Lineup, so5Leaderboard } = useContext(Context)!;
  const usedCards = getUsedCards({ lineup, so5Lineup, so5Leaderboard });
  const sentInLiveOfferCards = getSentInDirectOfferCards(lineup);
  const listedCards = getListedCards(lineup);

  const warningCardsCount =
    usedCards.length + sentInLiveOfferCards.length + listedCards.length;
  return (
    <Dialog
      maxWidth="sm"
      open={open}
      title={
        <CenteredText16 bold>
          <FormattedMessage {...messages.dialogTitle} />
        </CenteredText16>
      }
      onClose={onCancel}
      body={
        <Body>
          {warningCardsCount > 0 && (
            <>
              <Title3>
                <FormattedMessage
                  {...messages.warningTitle}
                  values={{
                    cards: warningCardsCount,
                    warnings: (
                      <FormattedList
                        type="disjunction"
                        value={[
                          usedCards.length > 0 && (
                            <FormattedMessage
                              key="used"
                              {...messages.usedCards}
                              values={{
                                cards: warningCardsCount,
                              }}
                            />
                          ),

                          sentInLiveOfferCards.length > 0 && (
                            <FormattedMessage
                              key="sentInLiveOffer"
                              {...messages.sentInLiveOfferCards}
                              values={{
                                cards: warningCardsCount,
                              }}
                            />
                          ),
                          listedCards.length > 0 && (
                            <FormattedMessage
                              key="list"
                              {...messages.listedCards}
                              values={{
                                cards: warningCardsCount,
                              }}
                            />
                          ),
                        ].filter(Boolean)}
                      />
                    ),
                  }}
                />
              </Title3>
              <WarningRowList>
                {usedCards.map(({ card, lineupUsingThisPlayer }) => (
                  <WarningRow
                    key={card.slug}
                    card={card}
                    warning={
                      lineupUsingThisPlayer && (
                        <>
                          <DivisionLogoWrapper>
                            <DivisionLogo
                              so5Leaderboard={
                                lineupUsingThisPlayer!.so5Leaderboard!
                              }
                            />
                          </DivisionLogoWrapper>
                          <Text14>
                            <FormattedMessage
                              {...messages.usedInAnotherLineupWarning}
                              values={{
                                lineupDisplayName: formatLineupDisplayName(
                                  lineupUsingThisPlayer
                                ),
                                b: Bold,
                              }}
                            />
                          </Text14>
                        </>
                      )
                    }
                  />
                ))}
                <>
                  {Object.values(
                    groupBy(
                      card => card.slug,
                      [...listedCards, ...sentInLiveOfferCards]
                    )
                  ).map(([card]) => (
                    <WarningRow
                      key={card.slug}
                      card={card}
                      warningLevel="error"
                      warning={
                        <div>
                          {listedCards.some(c => c.slug === card.slug) && (
                            <Row>
                              <FontAwesomeIcon icon={faStore} size="sm" />
                              <Text14>
                                <FormattedMessage
                                  {...messages.listedWarning}
                                  values={{
                                    b: Bold,
                                  }}
                                />
                              </Text14>
                            </Row>
                          )}
                          {sentInLiveOfferCards.some(
                            c => c.slug === card.slug
                          ) && (
                            <Row>
                              <FontAwesomeIcon icon={faRepeat} size="sm" />
                              <Text14>
                                <FormattedMessage
                                  {...messages.sentInLiveOfferWarning}
                                  values={{
                                    b: Bold,
                                  }}
                                />
                              </Text14>
                            </Row>
                          )}
                        </div>
                      }
                    />
                  ))}
                </>
              </WarningRowList>
            </>
          )}
          <Buttons>
            <Button color="red" medium fullWidth onClick={onCancel}>
              <FormattedMessage {...glossary.cancel} />
            </Button>
            <Button color="blue" medium fullWidth onClick={onContinue}>
              <FormattedMessage {...glossary.continue} />
            </Button>
          </Buttons>
        </Body>
      }
    />
  );
};

ConfirmWarningDialog.displayName = 'ConfirmWarningDialog';

export default ConfirmWarningDialog;
