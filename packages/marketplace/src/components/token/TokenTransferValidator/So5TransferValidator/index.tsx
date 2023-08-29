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
  So5TokenTransferValidatorCardQuery,
  So5TokenTransferValidatorCardQueryVariables,
} from './__generated__/index.graphql';

const SO5_TOKEN_TRANSFER_VALIDATOR_CARDS_QUERY = gql`
  query So5TokenTransferValidatorCardQuery($slugs: [String!]!, $first: Int!) {
    currentUser {
      slug
      paginatedCards(first: $first, slugs: $slugs) {
        nodes {
          assetId
          slug
          openedSo5Lineups {
            id
            ...formatLineupDisplayName_so5Lineup
          }
          liveSo5Lineup {
            id
            ...formatLineupDisplayName_so5Lineup
          }
        }
      }
    }
  }
  ${formatLineupDisplayName.fragments.so5Lineup}
` as TypedDocumentNode<
  So5TokenTransferValidatorCardQuery,
  So5TokenTransferValidatorCardQueryVariables
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
    id: 'So5TransferValidator.listTitle',
    defaultMessage: 'Listing this card will unregister:',
  },
  sendTradeTitle: {
    id: 'So5TransferValidator.sendTradeTitle',
    defaultMessage: 'Sending a trade including this card will unregister:',
  },
  receiveTradeTitle: {
    id: 'So5TransferValidator.receiveTradeTitle',
    defaultMessage: 'Accepting this trade will unregister:',
  },
  liveLineupWarning: {
    id: 'So5TransferValidator.liveLineupWarning',
    defaultMessage: '<e>Live</e> <b>{competition}</b> lineup',
  },
  upcomingLineupWarning: {
    id: 'So5TransferValidator.upcomingLineupWarning',
    defaultMessage: 'Upcoming <b>{competition}</b> lineup',
  },
});

const TITLE_MAPS = {
  list: messages.listTitle,
  send_trade: messages.sendTradeTitle,
  receive_trade: messages.receiveTradeTitle,
};

const So5TransferValidator = ({ slugs, children, transferContext }: Props) => {
  const { data, loading } = useQuery(SO5_TOKEN_TRANSFER_VALIDATOR_CARDS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { slugs, first: slugs.length },
  });

  const cards = data?.currentUser?.paginatedCards.nodes;

  const validationMessages =
    cards?.reduce<{ [key: string]: React.JSX.Element }>((acc, card) => {
      if (!card.openedSo5Lineups?.length && !card.liveSo5Lineup) {
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
                      card.openedSo5Lineups.length +
                      (card.liveSo5Lineup ? 1 : 0),
                  }}
                />
              </Text14>
            </Row>
            {card.liveSo5Lineup && (
              <Row>
                <Text14>
                  <FormattedMessage
                    {...messages.liveLineupWarning}
                    values={{
                      competition: formatLineupDisplayName(card.liveSo5Lineup),
                      b: Bold,
                      e: ErrorBold,
                    }}
                  />
                </Text14>
              </Row>
            )}
            {card.openedSo5Lineups.map(lineup => (
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
        cards?.filter(card => card.liveSo5Lineup).length || 0;
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
        ConsentMessage: cards?.some(card => card.liveSo5Lineup)
          ? ConsentMessage
          : undefined,
      })}
    </>
  );
};

const So5TransferValidatorContainer = (props: Props) => {
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
  return <So5TransferValidator {...props} />;
};

export default So5TransferValidatorContainer;
