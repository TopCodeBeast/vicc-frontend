import { gql } from '@apollo/client';
import { useReducer } from 'react';
import { useIntl } from 'react-intl';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { CurrentUser } from '@sorare/core/src/contexts/currentUser';
import { convertToCardHit } from '@sorare/core/src/lib/algolia';
import { tradeLabels } from '@sorare/core/src/lib/glossary';

import BuildingPage from './BuildingPage';
import { OfferUser } from './OfferUser';
import Summary from './Summary';
import {
  NewOfferBuilder_publicUserInfoInterface,
  NewOfferBuilder_token,
  NewOfferCardsQuery,
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
  receiveEth?: number;
  receiveMarketFeesEth?: number;
  sendCards?: NewOfferBuilder_token[];
  sendEth?: number;
};

type StagePage = React.ComponentType<
  SharedProps & StateProps<NewOfferBuilder_token>
>;

const tokenFragment = gql`
  fragment NewOfferBuilder_token on Token {
    assetId
    slug
    ...OfferBuilderBuildingPage_token
    ...OfferBuilderSummary_token
    ...useOnSubmit_token
  }
  ${useOnSubmit.fragments.token}
  ${Summary.fragments.token}
  ${BuildingPage.fragments.token}
`;

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
`;

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
  receiveEth: initialReceiveEth = 0,
  receiveMarketFeesEth: initialReceiveMarketFeesEth = 0,
  sendCards: initialSendCards = [],
  sendEth: initialSendEth = 0,
  counterOfferId = undefined,
  counterOfferSport = undefined,
  currentUser,
  lockReceiveEthInput,
}: Props) => {
  const onSubmit = useOnSubmit<NewOfferBuilder_token>(
    to,
    onClose,
    counterOfferId
  );
  const [state, dispatch] = useReducer(
    offerBuilderReducer,
    {
      initialReceiveCards,
      initialReceiveEth,
      initialReceiveMarketFeesEth,
      initialSendCards,
      initialSendEth,
      submit: onSubmit,
      convertToAlgoliaCardHit: convertToCardHit,
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
  `,
  token: tokenFragment,
};

export default NewOfferBuilder;
