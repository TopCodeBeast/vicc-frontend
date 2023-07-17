import { gql } from '@apollo/client';
import { ReactNode, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
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
// import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { StackProps, assetIdFromHit } from '@sorare/core/src/lib/algolia';
import { groupBy } from '@sorare/core/src/lib/arrays';
// import { formatScarcity } from '@sorare/core/src/lib/cards';

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
  hideSorareUser?: boolean;
  stack?: StackProps;
  TokenPropertiesButtonComponent?: ReactNode;
};

const tokenFragment = gql`
  fragment Token_token on Token {
    assetId
    slug
    ...TokenContent_token
  }
  ${TokenContent.fragments.token}
`;

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
`;

const ATTRIBUTES_TO_RETRIEVE = ['objectID', 'asset_id', 'sport'];

const TooltipDescription = ({ token }: { token: Token_token }) => {
  // const { main } = useAmountWithConversion({
  //   monetaryAmount: {
  //     referenceCurrency: SupportedCurrency.WEI,
  //     [SupportedCurrency.WEI.toLowerCase()]:
  //       token.liveSingleSaleOffer?.priceWei || '0',
  //   },
  // });

  return (
    <Text14 color="var(--c-neutral-600)">
      <>TooltipDescription555</>
      {/* <FormattedMessage
        {...marketplaceTaskDescription[
          MarketplaceOnboardingStep.marketplaceItem
        ]}
        values={{
          playerName: token.metadata.playerDisplayName,
          price: main,
          rarity: formatScarcity(token.metadata.rarity),
        }}
      /> */}
    </Text14>
  );
};

export const Token = ({
  token,
  stack,
  displayMarketplaceOnboardingTooltip,
  ...rest
}: Props) => {
  const { step, setStep, task } = useManagerTaskContext();
  const { up: isTablet } = useScreenSize('tablet');
  const { algoliaCardIndexes } = useConfigContext();

  const stacked = stack && stack.count > 1;
  console.log('tokentokentokentokentokentoken', token)

  const lowestPriceHits = useFacetedSearchCards({
    index: algoliaCardIndexes['Lowest Price'],
    distinct: false,
    facetFilters: `sale.distinct_key:${stack?.algoliaDistinctKey}`,
    attributesToRetrieve: ATTRIBUTES_TO_RETRIEVE,
    hitsPerPage: 20,
    params: stack?.params,
    skip: false,//!stacked || !!token.liveSingleSaleOffer, //TODO*****
  });

  const { data } = useQuery<
    AlternativeStackedTokensByIdsQuery,
    AlternativeStackedTokensByIdsQueryVariables
  >(ALTERNATIVE_STACKED_TOKENS_BY_IDS_QUERY, {
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
    const alternativeHit = null/*lowestPriceHits?.hits.find(
      hit => tokensByAssetId[assetIdFromHit(hit)]?.[0]?.liveSingleSaleOffer
    );*/ //TODO****
    if (!alternativeHit) {
      return token;
    }
    return tokensByAssetId[assetIdFromHit(alternativeHit)]?.[0] || token;
  }, [token, data, lowestPriceHits]);

  const stackedTokensCount = useMemo(() => {
    if (!lowestPriceHits) return stack?.count || 1;

    const alreadySoldHits = 0;///TODO******
      //data?.tokens.nfts.filter(t => !t.liveSingleSaleOffer).length || 0;

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
                  defaultMessage="🌟 You can try to win one as a reward in Sorare Competitions"
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
        {...rest}
      />
    </ManagerTaskTooltip>
  );
};

Token.fragments = {
  token: tokenFragment,
};
