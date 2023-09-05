import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link, generatePath, matchPath } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import {
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_TRANSFER_MARKET,
  MLB_PRIMARY_MARKET,
  MLB_SECONDARY_MARKET,
  NBA_PRIMARY_MARKET,
  NBA_SECONDARY_MARKET,
} from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';

const messages = defineMessages({
  goToSecondary: {
    id: 'EmptyMarket.goToSecondary',
    defaultMessage: 'Go to secondary market',
  },
  goToPrimary: {
    id: 'EmptyMarket.goToPrimary',
    defaultMessage: 'Go to primary market',
  },
});

const primaryMarketPaths: { [key in Sport]: string } = {
  FOOTBALL: FOOTBALL_NEW_SIGNINGS,
  BASEBALL: MLB_PRIMARY_MARKET,
  NBA: NBA_PRIMARY_MARKET,
};

const secondaryMarketPaths: { [key in Sport]: string } = {
  FOOTBALL: FOOTBALL_TRANSFER_MARKET,
  BASEBALL: MLB_SECONDARY_MARKET,
  NBA: NBA_SECONDARY_MARKET,
};

const CTA = styled(Button)`
  margin-top: var(--double-unit);
`;

type Props = {
  ctaMessage?: ReactNode;
};

export const EmptyMarket = ({ ctaMessage }: Props) => {
  const { pathname } = window.location;
  const { sport } = useSportContext();
  const isPrimary =
    matchPath(NBA_PRIMARY_MARKET, pathname) ||
    matchPath(MLB_PRIMARY_MARKET, pathname) ||
    matchPath(FOOTBALL_NEW_SIGNINGS, pathname);

  const to = generatePath(
    isPrimary
      ? secondaryMarketPaths[sport ?? Sport.CRICKET]
      : primaryMarketPaths[sport ?? Sport.CRICKET]
  );
  const linkMessage = isPrimary ? messages.goToSecondary : messages.goToPrimary;
  return (
    <CTA medium component={Link} to={to} color="blue">
      {ctaMessage || <FormattedMessage {...linkMessage} />}
    </CTA>
  );
};

export default EmptyMarket;
