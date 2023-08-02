import { TypedDocumentNode, gql } from '@apollo/client';
import { faInfoCircle, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Drawer as MuiDrawer } from '@material-ui/core';
import classnames from 'classnames';
import { differenceInSeconds, parseISO } from 'date-fns';
import { ReactNode, memo, useEffect, useState } from 'react';
import { MessageDescriptor } from 'react-intl';
import { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import CreateDeckDialog from '@sorare/core/src/components/deck/CreateDeckDialog';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import useCustomDecks from '@sorare/core/src/hooks/decks/useCustomDecks';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import { StackProps } from '@sorare/core/src/lib/algolia';
import { isType } from '@sorare/core/src/lib/gql';
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
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import { CardResultsProps } from '@sorare/marketplace/src/searchCards/AdvancedCardSearch/types';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import BundledAuctionEligibilityByAssetIds from '@football/components/auction/BundledAuctionEligibilityByAssetIds';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import CardPropertiesByAssetId from '@football/components/card/CardPropertiesByAssetId';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import CardTeamsByAssetId from '@football/components/card/CardTeamsByAssetId';
import CommonCardPreview from '@football/components/card/CommonCardPreview';
import AddCardToDeck from '@football/components/deck/AddCardToDeck';
import PlayerDetails from '@football/components/so5/ComposeTeam/responsive/PlayerDetails';

import { CardPreviewGrid_card } from './__generated__/index.graphql';

type Item = CardPreviewGrid_card & { stack?: StackProps };

const MAX_AUTO_NEXT_PAGE = 5;

type Props = CardResultsProps & {
  items: Item[];
  page: number;
  nbPages: number;
  setPage: (page: number) => void;
  emptyContentsMessage?: MessageDescriptor;
  loading?: boolean;
  tokenAction?: ReactNode;
};

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

const TokenItem = ({
  item,
  displayMarketplaceOnboardingTooltip,
  galleryOwnerSlug,
  hideOwner,
  hideSorareUser,
  setCardOpened,
  showFavorite,
  hideDetails,
  action,
}: {
  item: Item;
  displayMarketplaceOnboardingTooltip?: boolean;
  galleryOwnerSlug?: string;
  hideOwner?: boolean;
  hideSorareUser?: boolean;
  showFavorite: boolean;
  setCardOpened?: (item: Item) => void;
  hideDetails: boolean;
  action?: ReactNode;
}) => {
  if (item?.token) {
    return (
      <Token
        token={item.token}
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
                setCardOpened?.(item);
              }}
              icon={faInfoCircle}
            />
          ) : (
            <TokenFavoriteButton token={item.token} show={showFavorite} />
          )
        }
        hideDetails={hideDetails}
        action={action}
      />
    );
  }
  return (
    <CommonCardPreview card={item} hideDetails={hideDetails} action={action} />
  );
};

export const CardPreviewGrid = ({
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
  editableLists,
}: Props) => {
  const { decks } = useCustomDecks();
  const { hideDetails } = useMarketplaceContext();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
  const [addCardToDeck, setAddCardToDeck] =
    useState<CardPreviewGrid_card | null>(null);
  const [cardOpened, setCardOpened] = useState<CardPreviewGrid_card | null>(
    null
  );
  const { up: isXLarge } = useScreenSize(1880);
  const { up: isTablet } = useScreenSize('tablet');
  const unstacked = useQueryString(SEARCH_PARAMS.UNSTACKED);
  const stacked = stackable && !unstacked;

  const filteredItems = items.filter(item => {
    if (isType(item, 'Card')) {
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
          latestEnglishAuction &&
          !latestEnglishAuction.open
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

  // As we filter out the hits we receive from Algolia to handle indexing lags
  // we might be in a situation where there are no more hits to display.
  // This logic will go to the next page up to reaching page `MAX_AUTO_NEXT_PAGE` (safety)
  // until there are some hits left to display.
  useEffect(() => {
    if (
      filteredItems.length === 0 &&
      items.length !== 0 &&
      (removeFinishedAuctions || removeEndedSingleSaleOffers) &&
      page < nbPages - 1 &&
      page < MAX_AUTO_NEXT_PAGE
    ) {
      setPage(page + 1);
    }
  }, [
    setPage,
    items,
    filteredItems,
    nbPages,
    page,
    removeFinishedAuctions,
    removeEndedSingleSaleOffers,
  ]);

  if (filteredItems.length === 0) {
    if (loading) {
      return <LoadingIndicator />;
    }
    return <Empty isGallery={!!galleryOwnerSlug} topic={topic} />;
  }

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
        className={classnames({ hideDetails, showDesktopFilter })}
      >
        {filteredItems.map((item, i) => {
          return (
            <AnimatedGridItem
              onMouseEnter={() => setHoveredItem(getItemKey(item))}
              onMouseLeave={() => setHoveredItem(null)}
              key={getItemKey(item)}
              flipId={getItemKey(item)}
            >
              <TokenItem
                item={item}
                displayMarketplaceOnboardingTooltip={i === 0}
                galleryOwnerSlug={galleryOwnerSlug}
                hideOwner={hideOwner}
                hideSorareUser={hideSorareUser}
                setCardOpened={setCardOpened}
                showFavorite={hoveredItem === getItemKey(item) || !isTablet}
                hideDetails={!!(hideDetails && galleryOwnerSlug)}
                action={
                  editableLists ? (
                    <IconButton
                      onClick={() => {
                        if (!decks.length) {
                          setCreateListDialogOpen(true);
                        }
                        setAddCardToDeck(item);
                      }}
                      color="white"
                      icon={faPlus}
                      small
                    />
                  ) : undefined
                }
              />
            </AnimatedGridItem>
          );
        })}
      </AnimatedGrid>
      {loading && <GridOverlayLoadingIndicator />}
      {addCardToDeck && !createListDialogOpen && (
        <AddCardToDeck
          card={addCardToDeck}
          onClose={() => setAddCardToDeck(null)}
          addList={() => setCreateListDialogOpen(true)}
        />
      )}
      {createListDialogOpen && (
        <CreateDeckDialog
          open
          onClose={() => {
            setAddCardToDeck(addCardToDeck);
            setCreateListDialogOpen(false);
          }}
          skipRedirection
        />
      )}
      <Drawer
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
      </Drawer>
    </>
  );
};

const Memoized = memo(CardPreviewGrid);

const cardFragment = gql`
  fragment CardPreviewGrid_card on Card {
    slug
    assetId
    position: positionTyped
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
    ...BundledAuctionEligibilityByAssetIds_card
    ...Analytics_cardInfo
    ...CommonCardPreview_card
    ...CardTeamsByAssetId_card
    ...AddCardToDeck_card
  }
  ${Token.fragments.token}
  ${CardPropertiesByAssetId.fragments.card}
  ${BundledAuctionEligibilityByAssetIds.fragments.card}
  ${CommonCardPreview.fragments.card}
  ${analyticsFragments.cardInfo}
  ${CardTeamsByAssetId.fragments.card}
  ${TokenFavoriteButton.fragments.token}
  ${AddCardToDeck.fragments.card}
` as TypedDocumentNode<CardPreviewGrid_card>;

Memoized.fragments = {
  card: cardFragment,
};

export default Memoized;
