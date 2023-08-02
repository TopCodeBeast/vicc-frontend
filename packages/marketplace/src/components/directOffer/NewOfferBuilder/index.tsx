import { TypedDocumentNode, gql } from '@apollo/client';
import { useReducer } from 'react';
import { useIntl } from 'react-intl';

import {
  Currency,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import {
  CurrentUser,
  useCurrentUserContext,
} from '@sorare/core/src/contexts/currentUser';
import {
  MonetaryAmountOutput,
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { convertToCardHit } from '@sorare/core/src/lib/algolia';
import { tradeLabels } from '@sorare/core/src/lib/glossary';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import BuildingPage from './BuildingPage';
import { OfferUser } from './OfferUser';
import Summary from './Summary';
import {
  NewOfferBuilder_publicUserInfoInterface,
  NewOfferBuilder_token,
  NewOfferCardsQuery,
  NewOfferCardsQueryVariables,
} from './__generated__/index.graphql';
import reducer, { init } from './reducer';
import { OfferBuilderStage, StateProps } from './types';
import useOnSubmit from './useOnSubmit';

export interface SharedProps {
  to: NewOfferBuilder_publicUserInfoInterface;
  onClose: () => void;
  counterOfferId?: string;
  counterOfferSport?: Sport;
  currentUser: CurrentUser;
  lockReceiveEthInput?: boolean;
}

type Props = SharedProps & {
  receiveCards?: NewOfferBuilder_token[];
  receiveAmount?: MonetaryAmountOutput;
  receiveMarketFeesAmount?: MonetaryAmountOutput;
  sendCards?: NewOfferBuilder_token[];
  sendAmount?: MonetaryAmountOutput;
  referenceCurrency?: SupportedCurrency;
};

type StagePage = React.ComponentType<
  React.PropsWithChildren<SharedProps & StateProps<NewOfferBuilder_token>>
>;

const tokenFragment = gql`
  fragment NewOfferBuilder_token on Token {
    assetId
    slug
    publicMinPrices {
      ...MonetaryAmountFragment_monetaryAmount
    }
    ...OfferBuilderBuildingPage_token
    ...OfferBuilderSummary_token
    ...useOnSubmit_token
  }
  ${monetaryAmountFragment}
  ${useOnSubmit.fragments.token}
  ${Summary.fragments.token}
  ${BuildingPage.fragments.token}
` as TypedDocumentNode<NewOfferBuilder_token>;

const NEW_OFFER_CARDS_QUERY = gql`
  query NewOfferCardsQuery($assetIds: [String!]!) {
    tokens {
      nfts(assetIds: $assetIds) {
        assetId
        slug
        ...NewOfferBuilder_token
      }
    }
  }
  ${tokenFragment}
` as TypedDocumentNode<NewOfferCardsQuery, NewOfferCardsQueryVariables>;

const SummaryPage = ({
  to,
  counterOfferId,
  state,
  dispatch,
  onClose,
  currentUser,
}: SharedProps & StateProps<NewOfferBuilder_token>) => {
  const { formatMessage } = useIntl();
  const title = formatMessage(
    counterOfferId ? tradeLabels.counterOfferWith : tradeLabels.tradeWith,
    {
      nickname: to.nickname,
    }
  );
  return (
    <Summary
      title={title}
      cancel={onClose}
      state={state}
      dispatch={dispatch}
      receiver={<OfferUser user={to} isReceiver />}
      sender={<OfferUser user={currentUser} />}
    />
  );
};

const OfferBuilderInitialPage = ({
  state,
  dispatch,
  onClose,
  to,
  counterOfferId,
  counterOfferSport,
  currentUser,
  lockReceiveEthInput,
}: SharedProps & StateProps<NewOfferBuilder_token>) => {
  return (
    <BuildingPage<NewOfferBuilder_token, NewOfferCardsQuery>
      onClose={onClose}
      query={NEW_OFFER_CARDS_QUERY}
      state={state}
      dispatch={dispatch}
      counterOfferId={counterOfferId}
      counterOfferSport={counterOfferSport}
      to={to}
      receiver={<OfferUser user={to} isReceiver />}
      sender={<OfferUser user={currentUser} />}
      lockReceiveEthInput={lockReceiveEthInput}
    />
  );
};

const stageComponents: { [key in OfferBuilderStage]: StagePage } = {
  confirming: SummaryPage,
  submitting: SummaryPage,
  building: OfferBuilderInitialPage,
};

const offerBuilderReducer = reducer<NewOfferBuilder_token>();

export const NewOfferBuilder = ({
  onClose,
  to,
  receiveCards: initialReceiveCards = [],
  receiveAmount: initialReceiveAmount = zeroMonetaryAmount,
  receiveMarketFeesAmount: initialReceiveMarketFeesAmount = zeroMonetaryAmount,
  sendCards: initialSendCards = [],
  sendAmount: initialSendAmount = zeroMonetaryAmount,
  counterOfferId = undefined,
  counterOfferSport = undefined,
  currentUser,
  lockReceiveEthInput,
  referenceCurrency,
}: Props) => {
  const {
    currency,
    fiatCurrency: { code },
    walletPreferences: { showFiatWallet, showEthWallet },
  } = useCurrentUserContext();
  const onSubmit = useOnSubmit<NewOfferBuilder_token>(
    to,
    onClose,
    counterOfferId
  );
  const initialCurrency =
    currency === Currency.ETH
      ? SupportedCurrency.WEI
      : (code as SupportedCurrency);

  const [state, dispatch] = useReducer(
    offerBuilderReducer,
    {
      initialReceiveAmount,
      initialSendCards,
      initialSendAmount,
      submit: onSubmit,
      initialReceiveMarketFeesAmount,
      initialReceiveCurrency:
        referenceCurrency ||
        (showEthWallet && initialCurrency) ||
        (showFiatWallet && (code as SupportedCurrency)) ||
        undefined,
      initialSendCurrency:
        referenceCurrency ||
        (showEthWallet && initialCurrency) ||
        (showFiatWallet && (code as SupportedCurrency)) ||
        undefined,
      convertToAlgoliaCardHit: convertToCardHit,
      initialReceiveCards,
    },
    init
  );

  const { stage } = state;

  const Component = stageComponents[stage];

  return (
    <Component
      counterOfferId={counterOfferId}
      counterOfferSport={counterOfferSport}
      onClose={onClose}
      to={to}
      dispatch={dispatch}
      state={state}
      currentUser={currentUser}
      lockReceiveEthInput={lockReceiveEthInput}
    />
  );
};

NewOfferBuilder.fragments = {
  user: gql`
    fragment NewOfferBuilder_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      id
      ...OfferBuilderBuildingPage_publicUserInfoInterface
      ...OfferUser_publicUserInfoInterface
    }
    ${BuildingPage.fragments.user}
    ${OfferUser.fragments.publicUserInfoInterface}
  ` as TypedDocumentNode<NewOfferBuilder_publicUserInfoInterface>,
  token: tokenFragment,
};

export default NewOfferBuilder;
