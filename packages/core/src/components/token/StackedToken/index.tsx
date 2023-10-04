import { TypedDocumentNode, gql } from '@apollo/client';
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import {
  Link,
  generatePath,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { ValidWidths } from '@core/atoms/ui/ResponsiveImg';
import StackedCards from '@core/components/cards/StackedCards';
import { indexStateToRoute } from '@core/components/search/InstantSearch';
import { SEARCH_PARAMS } from '@core/components/search/InstantSearch/types';
import { SECONDARY_MARKET_STACK_SHOW_BY_SPORT } from '@core/constants/routes';
import useEvents from '@core/lib/events/useEvents';

import { StackedToken_token } from './__generated__/index.graphql';

const StackedToken = ({
  token,
  width = 320,
  count,
}: {
  token: StackedToken_token;
  width?: ValidWidths;
  count: number;
}) => {
  const { pictureUrl, slug, metadata, sport } = token;
  const track = useEvents();
  const location = useLocation();
  const { indexUiState } = useInstantSearch();
  const [searchParams] = useSearchParams();

  const url = useMemo(() => {
    const queryParams = Object.fromEntries(searchParams);
    const currentStateParams: Record<string, unknown> = {
      ...queryParams,
      ...indexStateToRoute(indexUiState),
    };

    // do not forward some query params to the stack view as they are meaningless
    const notForwardableParamsKey: string[] = [
      SEARCH_PARAMS.SORT,
      SEARCH_PARAMS.PAGE,
      SEARCH_PARAMS.QUERY,
    ];
    const forwardableParams = Object.fromEntries(
      Object.entries(currentStateParams).filter(
        ([key]) => !notForwardableParamsKey.includes(key)
      )
    );

    // store backUrl
    if (location.search) {
      forwardableParams.previousParams = qs.stringify(currentStateParams, {
        addQueryPrefix: true,
      });
    }

    return `${generatePath(SECONDARY_MARKET_STACK_SHOW_BY_SPORT[sport], {
      player_slug: metadata.playerSlug,
      rarity: metadata.rarity,
    })}?${qs.stringify(forwardableParams)}`;
  }, [
    indexUiState,
    location.search,
    metadata.playerSlug,
    metadata.rarity,
    searchParams,
    sport,
  ]);

  const onClick = useCallback(() => {
    const params = {
      playerSlug: metadata.playerSlug,
      scarcity: metadata.rarity,
      teamSlug: metadata.teamSlug,
      season: metadata.seasonStartYear,
    };
    track('Click Stack', params);
  }, [metadata, track]);

  return (
    <Link to={url} onClick={onClick}>
      <StackedCards src={pictureUrl!} alt={slug} width={width} count={count} />
    </Link>
  );
};

StackedToken.fragments = {
  token: gql`
    fragment StackedToken_token on Token {
      assetId
      slug
      pictureUrl(derivative: "tinified")
      sport
      metadata {
        ... on TokenMetadataInterface {
          id
          playerSlug
          teamSlug
          rarity
          seasonStartYear
        }
      }
    }
  ` as TypedDocumentNode<StackedToken_token>,
};

export default StackedToken;
