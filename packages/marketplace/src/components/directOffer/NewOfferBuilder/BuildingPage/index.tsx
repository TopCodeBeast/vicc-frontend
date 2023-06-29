import { gql, useApolloClient } from '@apollo/client';
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { ReactNode, useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import Warning from '@sorare/core/src/contexts/intl/Warning';
import { useSentryContext } from '@sorare/core/src/contexts/sentry';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { CardHit, tokenHitFragment } from '@sorare/core/src/lib/algolia';
import { tradeLabels } from '@sorare/core/src/lib/glossary';
import { toWei } from '@sorare/core/src/lib/wei';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';
import useHasInsufficientFundsInWallets from '@marketplace/hooks/useHasInsufficientFundsInWallets';
import useMarketFeesHelperStatus from '@marketplace/hooks/useMarketFeesHelperStatus';

import CardPicker from '../CardPicker';
import OfferSide from '../OfferSide';
import offerSideMessages from '../OfferSide/i18n';
import {
  refreshCardData,
  switchToConfirming,
  updateReceiveCards,
  updateSendCards,
} from '../actions';
import { Actions, StateProps } from '../types';
import AmountInput from './AmountInput';
import InputDuration from './InputDuration';
import { TradePaymentMethods } from './TradePaymentMethods';
import {
  FootballCardsQuery,
  FootballCardsQueryVariables,
  OfferBuilderBuildingPage_publicUserInfoInterface,
  OfferBuilderBuildingPage_token,
} from './__generated__/index.graphql';

const StyledTooltip = styled(Tooltip)`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 calc(var(--marginBottom) * 1px);
  margin: 0;
`;
const CenteredTitle6 = styled(Title6)`
  text-align: center;
`;
const WarningContainer = styled.div`
  padding: var(--double-unit);
`;
const ETHOnlyWarningContainer = styled.div`
  display: inline-flex;
  gap: var(--double-unit);
  align-items: center;
`;
const Row = styled.div`
  display: flex;
  flex-direction: column;
  & > :not(:first-child) {
    border-top: 1px solid var(--c-neutral-300);
  }
  & > :last-child {
    margin-bottom: var(--double-unit);
  }
  & > * {
    padding: var(--double-unit) var(--triple-unit);
    flex-grow: 1;
    width: 100%;
  }
  @media ${tabletAndAbove} {
    & > :not(:first-child) {
      border-top: none;
    }
    flex-direction: row;
    align-items: flex-start;
  }
`;
const ActionWrapper = styled.div`
  padding: var(--triple-unit);
  margin-top: auto;
  box-shadow: 0px 14px 50px rgba(0, 0, 0, 0.2);
`;

interface Props<DATA, QUERY_RESULT extends { tokens: { nfts: DATA[] } }>
  extends StateProps<DATA> {
  to: OfferBuilderBuildingPage_publicUserInfoInterface;
  onClose: () => void;
  query: TypedDocumentNode<QUERY_RESULT, { assetIds: string[] }>;
  counterOfferId?: string;
  counterOfferSport?: Sport;
  sender: ReactNode;
  receiver: ReactNode;
  lockReceiveEthInput?: boolean;
}

const FOOTBALL_CARDS_QUERY = gql`
  query FootballCardsQuery($slugs: [String!]!) {
    cards(slugs: $slugs) {
      assetId
      slug
    }
  }
`;

const tokenFragment = gql`
  fragment OfferBuilderBuildingPage_baseToken on Token {
    slug
    assetId
    ...OfferSide_token
  }
  ${OfferSide.fragments.token}
`;

const messages = defineMessages({
  sendTrade: {
    id: 'OfferBuilder.BuildingPage.sendTrade',
    defaultMessage: 'Send the trade',
  },
  sendCounterOffer: {
    id: 'OfferBuilder.BuildingPage.sendCounterOffer',
    defaultMessage: 'Review counter offer',
  },
  counterOfferWarning: {
    id: 'OfferBuilder.BuildingPage.counterOfferWarning',
    defaultMessage:
      '💡 Sending this counter offer will reject the previous offer.',
  },
});

const isFootballCard = (card: CardHit) => card.sport === 'football';

const BuildingPage = <
  DATA extends OfferBuilderBuildingPage_token,
  QUERY_RESULT extends { tokens: { nfts: DATA[] } }
>({
  to,
  state,
  dispatch,
  onClose,
  query,
  counterOfferId,
  counterOfferSport,
  sender,
  receiver,
  lockReceiveEthInput,
}: Props<DATA, QUERY_RESULT>) => {
  const {
    flags: { useNewWallet = false },
  } = useFeatureFlags();

  const { toMonetaryAmount } = useMonetaryAmount();
  const setConfirming = useCallback(
    () => dispatch(switchToConfirming),
    [dispatch]
  );
  const {
    sendEth,
    receiveEth,
    sendCards,
    cardsData,
    receiveCards,
    stage,
    valid,
    isTradeForNothing,
    paymentMethod,
  } = state;
  const hasInsufficientFundsInWallets = useHasInsufficientFundsInWallets();
  const { insufficientFundsInEthWallet, insufficientFundsInFiatWallet } =
    hasInsufficientFundsInWallets(
      toMonetaryAmount({
        wei: toWei(sendEth),
        referenceCurrency: SupportedCurrency.WEI,
      })
    );
  const invalid =
    !valid ||
    (useNewWallet &&
      insufficientFundsInEthWallet &&
      paymentMethod === WalletPaymentMethod.ETH_WALLET) ||
    (insufficientFundsInFiatWallet &&
      paymentMethod === WalletPaymentMethod.FIAT_WALLET);
  const client = useApolloClient();
  const { showNotification } = useSnackNotificationContext();
  const { sendSafeError } = useSentryContext();
  const [loading, setLoading] = useState(false);

  const { up: isTablet } = useScreenSize('tablet');
  const marketFeeStatus = useMarketFeesHelperStatus(
    sendCards.map(c => cardsData[c.objectID]).filter(Boolean)
  );
  const { sport } = useSportContext();

  const getAssetIdsFromCardHits = useCallback(
    async (cards: CardHit[]) => {
      // ObjectId are slug for SO5, so we need to get their assetId from API
      const footballSlugs = cards
        .filter(card => {
          return isFootballCard(card);
        })
        .map(card => {
          return card.objectID;
        });
      const otherAssetIds = cards
        .filter(card => {
          return !isFootballCard(card);
        })
        .map(card => {
          return idFromObject(card.objectID)!;
        });
      if (footballSlugs && footballSlugs.length > 0) {
        const data2 = await client.query<
          FootballCardsQuery,
          FootballCardsQueryVariables
        >({
          query: FOOTBALL_CARDS_QUERY,
          variables: {
            slugs: footballSlugs,
          },
        });
        const { data } = data2;

        if (data) {
          const footballAssetIds = data.cards.map(card => card.assetId!);
          return [...footballAssetIds, ...otherAssetIds];
        }
        return otherAssetIds;
      }

      return otherAssetIds;
    },
    [client]
  );

  const setCards = useCallback(
    async (
      previousState: CardHit[],
      newState: CardHit[],
      actionFactory: (cards: CardHit[]) => Actions<DATA>
    ) => {
      setLoading(true);
      try {
        const newCardData = { ...state.cardsData };
        previousState.forEach(
          c => newCardData[c.objectID!] && delete newCardData[c.objectID!]
        );
        const assetIds = await getAssetIdsFromCardHits(newState);
        const { data } = await client.query<
          QUERY_RESULT,
          { assetIds: string[] }
        >({
          query,
          variables: {
            assetIds: assetIds.filter(Boolean),
          },
        });

        newState.forEach(c => {
          const associatedToken = data.tokens.nfts.find(token => {
            if (token.sport === Sport.FOOTBALL) {
              return token.slug === c.objectID;
            }
            return token.assetId === idFromObject(c.objectID);
          });
          if (associatedToken) newCardData[c.objectID] = associatedToken;
        });

        dispatch(actionFactory(newState));
        dispatch(refreshCardData(newCardData));
        return Promise.resolve(true);
      } catch (e: any) {
        sendSafeError(e);
        showNotification('errors', { errors: e.message });
        return Promise.resolve(false);
      } finally {
        setLoading(false);
      }
    },
    [
      sendSafeError,
      dispatch,
      query,
      client,
      showNotification,
      state,
      getAssetIdsFromCardHits,
    ]
  );

  const setSendCards = useCallback(
    async cards => setCards(state.sendCards, cards, updateSendCards),
    [setCards, state]
  );

  const setReceiveCards = useCallback(
    async cards => setCards(state.receiveCards, cards, updateReceiveCards),
    [setCards, state]
  );

  const { currentUser } = useCurrentUserContext();

  const [cardSelectionState, setCardSelectionState] = useState<
    | {
        owner: { id: string };
        setCards: (cards: CardHit[]) => void;
        selectedCards: CardHit[];
      }
    | undefined
  >(undefined);

  const closeCardPicker = useCallback(
    () => setCardSelectionState(undefined),
    [setCardSelectionState]
  );

  const closeCardPickerOnSuccess = useCallback(
    success => {
      if (success) {
        closeCardPicker();
      }
    },
    [closeCardPicker]
  );

  const openReceiveCardSelectionPopup = useCallback(() => {
    setCardSelectionState({
      owner: to,
      selectedCards: receiveCards,
      setCards: (cards: CardHit[]) => {
        setReceiveCards(cards).then(closeCardPickerOnSuccess);
      },
    });
  }, [receiveCards, to, setReceiveCards, closeCardPickerOnSuccess]);

  const openSendCardSelectionPopup = useCallback(() => {
    setCardSelectionState({
      owner: currentUser!,
      selectedCards: sendCards,
      setCards: (cards: CardHit[]) => {
        setSendCards(cards).then(closeCardPickerOnSuccess);
      },
    });
  }, [sendCards, currentUser, setSendCards, closeCardPickerOnSuccess]);

  if (cardSelectionState) {
    return (
      <CardPicker
        onClose={closeCardPicker}
        title={offerSideMessages.addCard}
        selectedCards={cardSelectionState.selectedCards}
        confirmSelectedCards={cardSelectionState.setCards}
        owner={cardSelectionState.owner}
        counterOfferSport={counterOfferSport}
      />
    );
  }

  const renderCta = () => {
    const cta = (
      <LoadingButton
        color="blue"
        medium
        onClick={setConfirming}
        loading={stage === 'submitting' || loading}
        disabled={invalid}
        fullWidth
      >
        <FormattedMessage
          {...(counterOfferId ? messages.sendCounterOffer : messages.sendTrade)}
        />
      </LoadingButton>
    );
    if (isTradeForNothing)
      return (
        <StyledTooltip
          enterTouchDelay={0}
          leaveTouchDelay={3000}
          title={
            <Text14>
              {sendEth > 0 && receiveCards.length === 0 && (
                <FormattedMessage
                  id="OfferBuilder.BuildingPage.tradeForNothingWarning"
                  defaultMessage="You cannot send this trade without receiving at least one Card"
                />
              )}
              {receiveEth > 0 && sendCards.length === 0 && (
                <FormattedMessage
                  id="OfferBuilder.BuildingPage.tradeForNothingWarningSending"
                  defaultMessage="You cannot send this trade without sending at least one Card"
                />
              )}
            </Text14>
          }
          placement="top"
        >
          {cta}
        </StyledTooltip>
      );
    return cta;
  };

  const cashOnlyOffersSportPreference = to.profile.marketplacePreferences
    .find(
      marketplacePreference =>
        marketplacePreference.sport === (sport || counterOfferSport)
    )
    ?.preferences.find(({ name }) => name === 'cash_only_offers');

  return (
    <Dialog
      open
      maxWidth="md"
      onClose={onClose}
      fullScreen={!isTablet}
      title={
        <CenteredTitle6>
          <FormattedMessage
            {...(counterOfferId
              ? tradeLabels.counterOfferWith
              : tradeLabels.tradeWith)}
            values={{
              nickname: to.nickname,
            }}
          />
        </CenteredTitle6>
      }
      body={
        <Container>
          {counterOfferId && (
            <WarningContainer>
              <Warning
                variant="yellow"
                message={messages.counterOfferWarning}
              />
            </WarningContainer>
          )}
          <Row>
            <OfferSide
              cards={sendCards}
              cardsData={cardsData}
              setCards={setSendCards}
              title={sender}
              toggleAddCardOpened={openSendCardSelectionPopup}
              isOwnSide
              addCardDisabledWarning={
                !!cashOnlyOffersSportPreference?.value && (
                  <Warning variant="yellow">
                    <ETHOnlyWarningContainer>
                      <FontAwesomeIcon icon={faCircleInfo} size="1x" />
                      <Text14>
                        <FormattedMessage
                          id="NewOfferBuilder.OfferSide.managerOnlyAcceptingETH"
                          defaultMessage="{manager} is only accepting ETH on this trade."
                          values={{
                            manager: to.nickname,
                          }}
                        />
                      </Text14>
                    </ETHOnlyWarningContainer>
                  </Warning>
                )
              }
            >
              <AmountInput state={state} dispatch={dispatch} />
              {useNewWallet && sendEth > 0 && (
                <TradePaymentMethods
                  state={state}
                  dispatch={dispatch}
                  onClose={onClose}
                />
              )}
            </OfferSide>
            <OfferSide
              cards={receiveCards}
              cardsData={cardsData}
              setCards={setReceiveCards}
              title={receiver}
              toggleAddCardOpened={openReceiveCardSelectionPopup}
              displayMinPrices
            >
              {counterOfferId && !lockReceiveEthInput && (
                <AmountInput
                  state={state}
                  dispatch={dispatch}
                  receiver
                  counterOfferSport={counterOfferSport}
                  marketFeeStatus={marketFeeStatus}
                />
              )}
            </OfferSide>
          </Row>
          <Row>
            <InputDuration state={state} dispatch={dispatch} to={to} />
          </Row>
          <ActionWrapper>{renderCta()}</ActionWrapper>
        </Container>
      }
    />
  );
};

BuildingPage.fragments = {
  user: gql`
    fragment OfferBuilderBuildingPage_publicUserInfoInterface on PublicUserInfoInterface {
      id
      slug
      nickname
      profile {
        marketplacePreferences(sports: [FOOTBALL, NBA, BASEBALL]) {
          sport
          preferences {
            name
            value
          }
        }
      }
      hoursToAnswerTrades
    }
  `,
  token: gql`
    fragment OfferBuilderBuildingPage_token on Token {
      assetId
      slug
      sport
      ...useMarketFeesHelperStatus_token
      ...OfferBuilderBuildingPage_baseToken
      ...Algolia_CardHit_token
    }
    ${tokenFragment}
    ${tokenHitFragment}
    ${useMarketFeesHelperStatus.fragments.token}
  `,
};

export default BuildingPage;
