import { gql } from '@apollo/client';
import { ComponentType, useMemo } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { arrayToObject } from '@sorare/core/src/lib/arrays';
import { theme } from '@sorare/core/src/style/theme';

import { Token } from '@marketplace/components/token/Token';

import {
  TokensRowsByObjectIds,
  TokensRowsByObjectIdsVariables,
  TokensRows_card,
  TokensRows_token,
} from './__generated__/index.graphql';

const CardsWrapper = styled.div<{ hitsPerRow: number }>`
  display: grid;
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    overflow: auto;
    scroll-snap-type: x mandatory;
    grid-auto-flow: column;
    grid-template-columns: repeat(${({ hitsPerRow }) => hitsPerRow}, 1fr);
    & > * {
      scroll-snap-align: center;
      min-width: 320px;
    }
  }
`;

const Frame = styled.div`
  padding: var(--unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--unit);
`;

type Props = {
  hitsPerRow: number;
  slugs?: string[];
  assetIds?: string[];
  CardInfo?: ComponentType<{ assetId: string }>;
};

const token = gql`
  fragment TokensRows_token on Token {
    assetId
    slug
    ...Token_token
  }
  ${Token.fragments.token}
`;

const card = gql`
  fragment TokensRows_card on Card {
    assetId
    slug
    token {
      assetId
      slug
      ...TokensRows_token
    }
  }
  ${token}
`;

export const TOKENS_ROWS_BY_OBJECT_IDS_QUERY = gql`
  query TokensRowsByObjectIds($slugs: [String!], $assetIds: [String!]!) {
    cards(slugs: $slugs) {
      slug
      assetId
      ...TokensRows_card
    }
    tokens {
      nfts(assetIds: $assetIds) {
        assetId
        slug
        ...TokensRows_token
      }
    }
  }
  ${token}
  ${card}
`;

type MappedTokens = Record<string, TokensRows_token>;

export const TokensRow = ({ hitsPerRow, slugs = [], assetIds = [] }: Props) => {
  const { data, loading } = useQuery<
    TokensRowsByObjectIds,
    TokensRowsByObjectIdsVariables
  >(TOKENS_ROWS_BY_OBJECT_IDS_QUERY, {
    variables: {
      slugs,
      assetIds,
    },
    skip: slugs.length === 0 && assetIds.length === 0,
  });

  const mappedTokensFromSlugs: MappedTokens = useMemo(
    () =>
      arrayToObject<TokensRows_card, TokensRows_token>({
        key: c => c.slug,
        value: c => c.token!,
        list: data?.cards || [],
      }),
    [data?.cards]
  );

  const mappedTokensFromAssetIds: MappedTokens = useMemo(
    () =>
      arrayToObject<TokensRows_token>({
        key: t => t.assetId,
        value: t => t,
        list: data?.tokens.nfts || [],
      }),
    [data?.tokens.nfts]
  );

  if (!data || loading) {
    return <LoadingIndicator />;
  }

  return (
    <CardsWrapper hitsPerRow={hitsPerRow}>
      {mappedTokensFromAssetIds &&
        assetIds.map(assetId => (
          <Frame key={assetId}>
            <Token
              forceMobileLayout
              disableSportSpecific
              token={mappedTokensFromAssetIds[assetId]}
            />
          </Frame>
        ))}
      {mappedTokensFromSlugs &&
        slugs.map(slug => (
          <Frame key={slug}>
            <Token
              forceMobileLayout
              disableSportSpecific
              token={mappedTokensFromSlugs[slug]}
            />
          </Frame>
        ))}
    </CardsWrapper>
  );
};

TokensRow.fragments = {
  token,
  card,
};

export default TokensRow;
