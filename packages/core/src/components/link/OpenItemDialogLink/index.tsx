import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import {
  LEGACY_BUNDLED_AUCTION,
  LEGACY_CARD_SHOW,
  LEGACY_TOKEN_AUCTION,
} from '@core/constants/routes';
import { useSportContext } from '@core/contexts/sport';
import idFromObject from '@core/gql/idFromObject';
import { Link, LinkProps } from '@core/routing/Link';

interface Props {
  item: Item;
  children: ReactNode;
  className?: string;
  onClick?: LinkProps['onClick'];
  sport: Sport;
}

export interface Item {
  __typename:
    | 'Card'
    | 'BundledAuction'
    | 'EnglishAuction'
    | 'Auction'
    | 'TokenAuction'
    | 'Token'
    | 'BaseballCard'
    | 'NBACard';
  slug?: string;
  id?: string;
  blockchainId?: string;
  nfts?: { assetId: string }[];
}

const itemRoute = (item: Item) => {
  console.log('itemRoute', item.__typename)
  switch (item.__typename) {
    case 'Card':
    case 'Token':
    case 'BaseballCard':
    case 'NBACard':
      return { route: LEGACY_CARD_SHOW, params: { slug: item.slug } };
    case 'BundledAuction':
    case 'EnglishAuction':
    case 'Auction':
      return {
        route: LEGACY_BUNDLED_AUCTION,
        params: { slug: item.slug },
      };
    case 'TokenAuction':
      if (item?.nfts?.length && item?.nfts?.length > 1) {
        return {
          route: LEGACY_BUNDLED_AUCTION,
          params: { id: idFromObject(item.id) },
        };
      }
      if (item.slug) {
        // TODO(gabriel): remove this hack once BundledAuction are removed
        return {
          route: LEGACY_BUNDLED_AUCTION,
          params: { slug: item.slug },
        };
      }
      return {
        route: LEGACY_TOKEN_AUCTION,
        params: { id: idFromObject(item.id) },
      };
    default:
      // never reached
      return { route: '', params: {} }; //Modifed****
  }
};

export const OpenItemDialogLink = ({
  item,
  children,
  className,
  onClick,
  sport,
}: Props) => {
  const location = useLocation();
  const { generateSportPath } = useSportContext();
  const { route, params } = itemRoute(item);
  console.log('~~~~~~~~~~~~~~~~OpenItemDialogLink', route, params, sport);
  const dest = route
    ? `${generateSportPath(route, {
        params,
        sport,
      })}${location.search}`
    : undefined;

  console.log('dest', dest)
  if (!dest) {
    return null;
  }
  return (
    <Link
      to={dest}
      onClick={onClick}
      state={{
        item,
      }}
      className={className}
    >
      {children}
    </Link>
  );
};

export default OpenItemDialogLink;
