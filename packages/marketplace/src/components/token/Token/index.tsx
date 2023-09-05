import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { Text14 } from '@sorare/core/src/atoms/typography';
import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask, {
  marketplaceTaskDescription,
} from '@sorare/core/src/components/onboarding/managerTask/MarketplaceOnboardingTask';
import { useConfigContext } from '@sorare/core/src/contexts/config';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { zeroMonetaryAmount } from '@sorare/core/src/hooks/useMonetaryAmount';
import { StackProps, assetIdFromHit } from '@sorare/core/src/lib/algolia';
import { groupBy } from '@sorare/core/src/lib/arrays';
import { formatScarcity } from '@sorare/core/src/lib/cards';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import useFacetedSearchCards from '@marketplace/hooks/search/useFacetedSearchCards';

import { TokenContent } from './TokenContent';
import {
  AlternativeStackedTokensByIdsQuery,
  AlternativeStackedTokensByIdsQueryVariables,
  Token_token,
} from './__generated__/index.graphql';

export type Props = {
  token: Token_token;
  hideOwner?: boolean;
  disableSportSpecific?: boolean;
  displayMarketplaceOnboardingTooltip?: boolean;
  forceMobileLayout?: boolean;
  forceDesktopLayout?: boolean;
  galleryOwnerSlug?: string;
  hideViccUser?: boolean;
  stack?: StackProps;
  TokenPropertiesButtonComponent?: ReactNode;
  hideDetails?: boolean;
  action?: ReactNode;
};

const tokenFragment = gql`
  fragment Token_token on Token {
    assetId
    slug
    liveSingleSaleOffer {
      id
      receiverSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
    }
    ...TokenContent_token
  }
  ${monetaryAmountFragment}
  ${TokenContent.fragments.token}
` as TypedDocumentNode<Token_token>;

export const ALTERNATIVE_STACKED_TOKENS_BY_IDS_QUERY = gql`
  query AlternativeStackedTokensByIdsQuery($assetIds: [String!]!) {
    tokens {
      nfts(assetIds: $assetIds) {
        assetId
        slug
        ...Token_token
      }
    }
  }
  ${tokenFragment}
` as TypedDocumentNode<
  AlternativeStackedTokensByIdsQuery,
  AlternativeStackedTokensByIdsQueryVariables
>;

const ATTRIBUTES_TO_RETRIEVE = ['objectID', 'asset_id', 'sport'];

const TooltipDescription = ({ token }: { token: Token_token }) => {
  const { main } = useAmountWithConversion({
    monetaryAmount:
      token.liveSingleSaleOffer?.receiverSide.amounts || zeroMonetaryAmount,
  });

  return (
    <Text14 color="var(--c-neutral-600)">
      <FormattedMessage
        {...marketplaceTaskDescription[
          MarketplaceOnboardingStep.marketplaceItem
        ]}
        values={{
          playerName: token.metadata.playerDisplayName,
          price: main,
          rarity: formatScarcity(token.metadata.rarity),
        }}
      />
    </Text14>
  );
};

export const Token = ({
  token,
  stack,
  displayMarketplaceOnboardingTooltip,
  hideDetails,
  action,
  ...rest
}: Props) => {
  const { step, setStep, task } = useManagerTaskContext();
  const { up: isTablet } = useScreenSize('tablet');
  const { algoliaCardIndexes } = useConfigContext();

  const stacked = stack && stack.count > 1;

  const lowestPriceHits = useFacetedSearchCards({
    index: algoliaCardIndexes['Lowest Price'],
    distinct: false,
    facetFilters: `sale.distinct_key:${stack?.algoliaDistinctKey}`,
    attributesToRetrieve: ATTRIBUTES_TO_RETRIEVE,
    hitsPerPage: 20,
    params: stack?.params,
    skip: !stacked || !!token.liveSingleSaleOffer,
  });

  const { data } = useQuery(ALTERNATIVE_STACKED_TOKENS_BY_IDS_QUERY, {
    variables: {
      assetIds: lowestPriceHits?.hits.map(hit => assetIdFromHit(hit)) || [],
    },
    skip: !lowestPriceHits || lowestPriceHits.length === 0,
  });

  const actualToken = useMemo(() => {
    if (!lowestPriceHits || !data) {
      return token;
    }
    const tokensByAssetId = groupBy(t => t.assetId, data.tokens.nfts);
    const alternativeHit = lowestPriceHits?.hits.find(
      hit => tokensByAssetId[assetIdFromHit(hit)]?.[0]?.liveSingleSaleOffer
    );
    if (!alternativeHit) {
      return token;
    }
    return tokensByAssetId[assetIdFromHit(alternativeHit)]?.[0] || token;
  }, [token, data, lowestPriceHits]);

  const stackedTokensCount = useMemo(() => {
    if (!lowestPriceHits) return stack?.count || 1;

    const alreadySoldHits =
      data?.tokens.nfts.filter(t => !t.liveSingleSaleOffer).length || 0;

    return lowestPriceHits.nbHits - alreadySoldHits;
  }, [data?.tokens.nfts, lowestPriceHits, stack?.count]);
  return (
    <ManagerTaskTooltip
      name={MarketplaceOnboardingStep.marketplaceItem}
      title={
        <MarketplaceOnboardingTask
          name={MarketplaceOnboardingStep.marketplaceItem}
          content={
            <>
              <TooltipDescription token={token} />
              <Text14 color="var(--c-yellow-100)">
                <FormattedMessage
                  id="MarketplaceTaskDescription.tryToWin"
                  defaultMessage="🌟 You can try to win one as a reward in Vicc Competitions"
                />
              </Text14>
            </>
          }
          onClick={() => {
            setStep(MarketplaceOnboardingStep.buy);
          }}
        />
      }
      disable={!task || !displayMarketplaceOnboardingTooltip}
      placement={isTablet ? 'right-start' : 'bottom-start'}
      forceAreaHighlight={MarketplaceOnboardingStep.buy === step}
    >
      <TokenContent
        token={actualToken}
        stackedTokensCount={stackedTokensCount}
        displayMarketplaceOnboardingTooltip={
          displayMarketplaceOnboardingTooltip
        }
        hideDetails={!!hideDetails}
        action={action}
        {...rest}
      />
    </ManagerTaskTooltip>
  );
};

Token.fragments = {
  token: tokenFragment,
};
