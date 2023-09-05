import { TypedDocumentNode, gql } from '@apollo/client';
import { faWarning } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { formatLineupDisplayName } from '@sorare/core/src/lib/so5';

import {
  TokenTransferChildrenProps,
  TokenTransferValidatorProps,
} from '../types';
import { LiveLineupConsentMessage } from './LiveLineupConsentMessage';
import {
  Vicc5TokenTransferValidatorCardQuery,
  Vicc5TokenTransferValidatorCardQueryVariables,
} from './__generated__/index.graphql';

const SO5_TOKEN_TRANSFER_VALIDATOR_CARDS_QUERY = gql`
  query Vicc5TokenTransferValidatorCardQuery($slugs: [String!]!, $first: Int!) {
    currentUser {
      slug
      paginatedCards(first: $first, slugs: $slugs) {
        nodes {
          assetId
          slug
          openedVicc5Lineups {
            id
            ...formatLineupDisplayName_vicc5Lineup
          }
          liveVicc5Lineup {
            id
            ...formatLineupDisplayName_vicc5Lineup
          }
        }
      }
    }
  }
  ${formatLineupDisplayName.fragments.vicc5Lineup}
` as TypedDocumentNode<
  Vicc5TokenTransferValidatorCardQuery,
  Vicc5TokenTransferValidatorCardQueryVariables
>;

const WarningWrapper = styled.div`
  border-radius: var(--unit);
  padding: var(--unit) var(--intermediate-unit);
  background: rgba(var(--c-rgb-red-600), 0.1);
  border: 1px solid var(--c-static-red-300);
  color: var(--c-neutral-1000);
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--unit);
`;

const IconWrapper = styled.div`
  font: var(--t-14);
`;

const Error = styled.b`
  color: var(--c-static-red-300);
`;

const ErrorBold = (...chunks: string[]) => <Error>{chunks}</Error>;

type Props = {
  slugs: string[];
} & Pick<TokenTransferValidatorProps, 'children' | 'transferContext'>;

const messages = defineMessages({
  listTitle: {
    id: 'Vicc5TransferValidator.listTitle',
    defaultMessage: 'Listing this card will unregister:',
  },
  sendTradeTitle: {
    id: 'Vicc5TransferValidator.sendTradeTitle',
    defaultMessage: 'Sending a trade including this card will unregister:',
  },
  receiveTradeTitle: {
    id: 'Vicc5TransferValidator.receiveTradeTitle',
    defaultMessage: 'Accepting this trade will unregister:',
  },
  liveLineupWarning: {
    id: 'Vicc5TransferValidator.liveLineupWarning',
    defaultMessage: '<e>Live</e> <b>{competition}</b> lineup',
  },
  upcomingLineupWarning: {
    id: 'Vicc5TransferValidator.upcomingLineupWarning',
    defaultMessage: 'Upcoming <b>{competition}</b> lineup',
  },
});

const TITLE_MAPS = {
  list: messages.listTitle,
  send_trade: messages.sendTradeTitle,
  receive_trade: messages.receiveTradeTitle,
};

const Vicc5TransferValidator = ({ slugs, children, transferContext }: Props) => {
  const { data, loading } = useQuery(SO5_TOKEN_TRANSFER_VALIDATOR_CARDS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { slugs, first: slugs.length },
  });

  const cards = data?.currentUser?.paginatedCards.nodes;

  const validationMessages =
    cards?.reduce<{ [key: string]: React.JSX.Element }>((acc, card) => {
      if (!card.openedVicc5Lineups?.length && !card.liveVicc5Lineup) {
        return acc;
      }
      return {
        ...acc,
        [card.slug]: (
          <WarningWrapper key={card.slug}>
            <Row>
              <IconWrapper>
                <FontAwesomeIcon
                  icon={faWarning}
                  color="var(--c-static-red-300)"
                  size="sm"
                />
              </IconWrapper>
              <Text14>
                <FormattedMessage
                  {...TITLE_MAPS[transferContext]}
                  values={{
                    count:
                      card.openedVicc5Lineups.length +
                      (card.liveVicc5Lineup ? 1 : 0),
                  }}
                />
              </Text14>
            </Row>
            {card.liveVicc5Lineup && (
              <Row>
                <Text14>
                  <FormattedMessage
                    {...messages.liveLineupWarning}
                    values={{
                      competition: formatLineupDisplayName(card.liveVicc5Lineup),
                      b: Bold,
                      e: ErrorBold,
                    }}
                  />
                </Text14>
              </Row>
            )}
            {card.openedVicc5Lineups.map(lineup => (
              <Row key={lineup.id}>
                <Text14>
                  <FormattedMessage
                    {...messages.upcomingLineupWarning}
                    values={{
                      competition: formatLineupDisplayName(lineup),
                      b: Bold,
                    }}
                  />
                </Text14>
              </Row>
            ))}
          </WarningWrapper>
        ),
      };
    }, {}) || {};

  //TODO
  const ConsentMessage = undefined;/*useCallback<
    NonNullable<TokenTransferChildrenProps['ConsentMessage']>
  >(
    props => {
      const liveLineupsCount =
        cards?.filter(card => card.liveVicc5Lineup).length || 0;
      return (
        <LiveLineupConsentMessage
          lineupsCount={liveLineupsCount}
          transferContext={transferContext}
          {...props}
        />
      );
    },
    [cards, transferContext]
  );*/

  return (
    <>
      {children({
        validationMessages,
        loading,
        ConsentMessage: cards?.some(card => card.liveVicc5Lineup)
          ? ConsentMessage
          : undefined,
      })}
    </>
  );
};

const Vicc5TransferValidatorContainer = (props: Props) => {
  const { slugs, children } = props;

  if (slugs.length === 0) {
    return (
      <>
        {children({
          validationMessages: {},
          loading: false,
        })}
      </>
    );
  }
  return <Vicc5TransferValidator {...props} />;
};

export default Vicc5TransferValidatorContainer;
