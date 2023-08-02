import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import FlexFill from '@sorare/core/src/atoms/layout/FlexFill';
import ResponsiveRow from '@sorare/core/src/atoms/layout/ResponsiveRow';
import { Title4 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_USER_GALLERY_SQUADS } from '@sorare/core/src/constants/routes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import { sortBy } from '@sorare/core/src/lib/arrays';

import CustomDeckPreview from '@football/components/deck/CustomDeckPreview';
import EmptyDecks from '@football/components/deck/EmptyDecks';

import {
  DecksPreviewQuery,
  DecksPreviewQueryVariables,
} from './__generated__/index.graphql';

interface Props {
  userSlug: string;
  readOnly: boolean;
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--unit);
`;

const DECKS_PREVIEW_QUERY = gql`
  query DecksPreviewQuery($slug: String!) {
    user(slug: $slug) {
      slug
      customDecks(first: 3) {
        nodes {
          slug
          deckIndex
          ...CustomDeckPreview_customDeck
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
  ${CustomDeckPreview.fragments.customDeck}
` as TypedDocumentNode<DecksPreviewQuery, DecksPreviewQueryVariables>;

const MAX_DECK_DISPLAYED = 3; // also set in the query

export const DecksPreview = ({ userSlug, readOnly }: Props) => {
  const { data } = usePaginatedQuery(DECKS_PREVIEW_QUERY, {
    variables: {
      slug: userSlug,
    },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    connection: 'CustomDeckConnection',
  });

  const decks = data?.user.customDecks.nodes.filter(Boolean) || [];

  return (
    <Section>
      <Header>
        <Title4>
          <FormattedMessage id="DecksPreview.title" defaultMessage="Squads" />
        </Title4>
        {data?.user.customDecks.pageInfo.hasNextPage && (
          <Button
            color="blue"
            small
            component={Link}
            to={generatePath(FOOTBALL_USER_GALLERY_SQUADS, {
              slug: userSlug,
            })}
          >
            <FormattedMessage
              id="DecksPreview.viewAll"
              defaultMessage="View all squads"
            />
          </Button>
        )}
      </Header>
      {decks.length === 0 ? (
        <EmptyDecks />
      ) : (
        <ResponsiveRow>
          {sortBy(d => d!.deckIndex, decks).map(deck => (
            <CustomDeckPreview
              customDeck={deck}
              key={deck.slug}
              readOnly={readOnly}
            />
          ))}
          <FlexFill count={MAX_DECK_DISPLAYED - decks.length} />
        </ResponsiveRow>
      )}
    </Section>
  );
};

export default DecksPreview;
