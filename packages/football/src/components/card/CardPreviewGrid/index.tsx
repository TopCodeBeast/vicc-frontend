import { gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { Drawer as MuiDrawer } from '@material-ui/core';
import classNames from 'classnames';
import { differenceInSeconds, parseISO } from 'date-fns';
import { memo, useCallback, useEffect, useState } from 'react';
import { MessageDescriptor } from 'react-intl';
import { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
// import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import { StackProps } from '@sorare/core/src/lib/algolia';
import { isA } from '@sorare/core/src/lib/gql';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';
import { OverrideClasses } from '@sorare/core/src/style/utils';

import Empty from '@sorare/marketplace/src/components/market/Empty';
import {
  AnimatedGrid,
  AnimatedGridItem,
  GridOverlayLoadingIndicator,
} from '@sorare/marketplace/src/components/market/Grid';
import { Token } from '@sorare/marketplace/src/components/token/Token';
import TokenFavoriteButton from '@sorare/marketplace/src/components/token/TokenFavoriteButton';
import { CardResultsProps } from '@sorare/marketplace/src/searchCards/AdvancedCardSearch/types';

// // eslint-disable-next-line sorare/no-unrendered-component-imports
// import BundledAuctionEligibilityByAssetIds from '@football/components/auction/BundledAuctionEligibilityByAssetIds';
// // eslint-disable-next-line sorare/no-unrendered-component-imports
import CardPropertiesByAssetId from '@football/components/card/CardPropertiesByAssetId';
// // eslint-disable-next-line sorare/no-unrendered-component-imports
// import CardTeamsByAssetId from '@football/components/card/CardTeamsByAssetId';
import CommonCardPreview from '@football/components/card/CommonCardPreview';
// import PlayerDetails from '@football/components/so5/ComposeTeam/responsive/PlayerDetails';

import { CardPreviewGrid_card } from './__generated__/index.graphql';
import sample_cards from './cards.json';

type Item = CardPreviewGrid_card & { stack?: StackProps };

const MAX_AUTO_NEXT_PAGE = 5;

export interface Props extends CardResultsProps {
  items: Item[];
  cardsPerRow?: number;
  page: number;
  nbPages: number;
  setPage: (page: number) => void;
  emptyContentsMessage?: MessageDescriptor;
  loading?: boolean;
}

const outdatedAuction = (endDate: string) =>
  differenceInSeconds(Date.now(), parseISO(endDate)) > 10;

const [Drawer, classes] = OverrideClasses(MuiDrawer, null, {
  paper: css`
    width: 100%;
    background-color: var(--c-neutral-200);
    @media ${tabletAndAbove} {
      width: 380px;
    }
  `,
});

export const CardPreviewGrid = (props: Props) => {
  const {
    items,
    hideOwner,
    galleryOwnerSlug,
    removeFinishedAuctions,
    removeEndedSingleSaleOffers,
    page,
    nbPages,
    setPage,
    topic,
    hideSorareUser,
    stackable,
    loading,
    showDesktopFilter,
  } = props;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const unstacked = useQueryString(SEARCH_PARAMS.UNSTACKED);
  const stacked = stackable && !unstacked;
  const { up: isXLarge } = useScreenSize(1880);
  const { up: isTablet } = useScreenSize('tablet');

  const [cardOpened, setCardOpened] = useState<CardPreviewGrid_card | null>(
    null
  );
  console.log('items~~~~~~~~~~~~~~~~~~~', items)

  const filteredItems = items.filter(item => {
    if (isA<CardPreviewGrid_card>('Card', item)) {
      const { user, token } = item;
      if (token) {
        const { latestEnglishAuction, liveSingleSaleOffer } = token;
        if (!latestEnglishAuction && !liveSingleSaleOffer && !user) {
          // the card has been created but it is not yet on sale do not show
          return false;
        }

        // On secondary market, if a single sale offer has ended we shouldn't even display the hit
        // as otherwise we would show the owner and the date since when they own the card, not the new owner
        if (removeEndedSingleSaleOffers && !liveSingleSaleOffer) {
          if (stacked) {
            // do not remove it, let Token query Algolia+backend to get the next card to display
            return true;
          }
          return false;
        }

        // For new signings, if auction has been finished for more than 10 seconds, than remove from the list
        if (
          removeFinishedAuctions &&
          latestEnglishAuction /*&&
          !latestEnglishAuction.open*/
        ) {
          if (outdatedAuction(latestEnglishAuction.endDate)) {
            return false;
          }
        }
      }
    }
    return true;
  });

  const getItemKey = (item: Item) => {
    return item.assetId!;
  };

  const renderItem = useCallback(
    (item: Item, displayMarketplaceOnboardingTooltip?: boolean) => {
      const token = sample_cards[0].token;
      if (item?.token) {
        return (
          <Token
            token={token as any}// token={item.token} //TODO*****************
            galleryOwnerSlug={galleryOwnerSlug}
            displayMarketplaceOnboardingTooltip={
              displayMarketplaceOnboardingTooltip
            }
            hideOwner={hideOwner}
            hideSorareUser={hideSorareUser}
            stack={item.stack}
            TokenPropertiesButtonComponent={
              item.stack && item.stack.count > 1 ? (
                <IconButton
                  disableDebounce
                  component="div"
                  color="transparent"
                  small
                  onClick={() => {
                    setCardOpened(item);
                  }}
                  icon={faInfoCircle}
                />
              ) : (
                <TokenFavoriteButton
                  token={item.token}
                  show={hoveredItem === getItemKey(item) || !isTablet}
                />
              )
            }
          />
        );
      }
      return <CommonCardPreview card={item} />;
    },
    [galleryOwnerSlug, hideOwner, hideSorareUser, hoveredItem, isTablet]
  );

  // As we filter out the hits we receive from Algolia to handle indexing lags
  // we might be in a situation where there are no more hits to display.
  // This logic will go to the next page up to reaching page `MAX_AUTO_NEXT_PAGE` (safety)
  // until there are some hits left to display.
  // useEffect(() => {
  //   if (
  //     filteredItems.length === 0 &&
  //     items.length !== 0 &&
  //     (removeFinishedAuctions || removeEndedSingleSaleOffers) &&
  //     page < nbPages - 1 &&
  //     page < MAX_AUTO_NEXT_PAGE
  //   ) {
  //     setPage(page + 1);
  //   }
  // }, [
  //   setPage,
  //   items,
  //   filteredItems,
  //   nbPages,
  //   page,
  //   removeFinishedAuctions,
  //   removeEndedSingleSaleOffers,
  // ]);

  // if (filteredItems.length === 0 && loading) {
  //   return <LoadingIndicator />;
  // }

  // if (filteredItems.length === 0) {
  //   return <Empty isGallery={!!galleryOwnerSlug} topic={topic} />;
  // }

  const flipKey = `${filteredItems.map(item => getItemKey(item)).join('-')}${
    showDesktopFilter ? '-showDesktopFilter' : ''
  }`;

  return (
    <>
      <AnimatedGrid
        staggerConfig={{
          default: {
            speed: 0.4,
          },
        }}
        flipKey={flipKey}
        className={classNames({ showDesktopFilter })}
      >
        {filteredItems.map((item, i) => {
          return (
            <AnimatedGridItem
              onMouseEnter={() => setHoveredItem(getItemKey(item))}
              onMouseLeave={() => setHoveredItem(null)}
              key={getItemKey(item)}
              flipId={getItemKey(item)}
            >
              {renderItem(item, i === 0)}
            </AnimatedGridItem>
          );
        })}
      </AnimatedGrid>
      {loading && <GridOverlayLoadingIndicator />}
      {/* <Drawer
        open={!!cardOpened}
        anchor="right"
        classes={{
          paper: classes.paper,
        }}
        onClose={() => {
          setCardOpened(null);
        }}
        variant={isXLarge ? 'persistent' : 'temporary'}
      >
        {cardOpened && (
          <PlayerDetails
            card={cardOpened}
            slug={cardOpened.player.slug!}
            pictureUrl={cardOpened.pictureUrl}
            showCardBonusIndicator={false}
            onClose={() => {
              setCardOpened(null);
            }}
          />
        )}
      </Drawer> */}
    </>
  );
};

const Memoized = memo(CardPreviewGrid);

const cardFragment = gql`
  fragment CardPreviewGrid_card on Card {
    slug
    assetId
    # position: positionTyped
    position
    user {
      slug
    }
    token {
      latestEnglishAuction {
        id
        endDate
      }
      liveSingleSaleOffer {
        id
      }
      assetId
      slug
      ...Token_token
      ...TokenFavoriteButton_token
    }
    ...CardPropertiesByAssetId_card
    #...BundledAuctionEligibilityByAssetIds_card
    #...Analytics_cardInfo
    ...CommonCardPreview_card
    #...CardTeamsByAssetId_card
  }
  ${Token.fragments.token}
  ${CardPropertiesByAssetId.fragments.card}
  #{BundledAuctionEligibilityByAssetIds.fragments.card}
  ${CommonCardPreview.fragments.card}
  #{analyticsFragments.cardInfo}
  #{CardTeamsByAssetId.fragments.card}
  ${TokenFavoriteButton.fragments.token}
`;

Memoized.fragments = {
  card: cardFragment,
  auction: gql`
    fragment CardPreviewGrid_auction on EnglishAuctionInterface {
      slug
      open
      cancelled
      endDate
      cards {
        slug
        assetId
        ...CardPreviewGrid_card
      }
    }
    ${cardFragment}
  `,
};

export default Memoized;
