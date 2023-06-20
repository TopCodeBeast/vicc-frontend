import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/MarketplaceOnboardingTask';
import {
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_STARTER_BUNDLES,
  FOOTBALL_TRANSFER_MARKET,
} from '@sorare/core/src/constants/routes';
import { useConfigContext } from '@sorare/core/src/contexts/config';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import auctionsDesktop from '@sorare/football/src/pages/TransferMarket/assets/auctions_desktop.png';
import auctionsMobile from '@sorare/football/src/pages/TransferMarket/assets/auctions_mobile.png';
import managerSalesDesktop from '@sorare/football/src/pages/TransferMarket/assets/manager_sales_desktop.png';
import managerSalesMobile from '@sorare/football/src/pages/TransferMarket/assets/manager_sales_mobile.png';
import starterPacksDesktop from '@sorare/football/src/pages/TransferMarket/assets/starter_packs_desktop.png';
import starterPacksMobile from '@sorare/football/src/pages/TransferMarket/assets/starter_packs_mobile.png';

import { Entry } from './Entry';

const messages = defineMessages({
  desktopStarterPacksDescription: {
    id: 'TransferMarket.Home.desktopStarterPacksDescription',
    defaultMessage:
      'Buy curated teams of in-form players ready for the competition leaderboard',
  },
  mobileStarterPacksDescription: {
    id: 'TransferMarket.Home.mobileStarterPacksDescription',
    defaultMessage: 'Buy curated teams ready for the competition leaderboard',
  },
  starterPacksCount: {
    id: 'TransferMarket.Home.starterPacksCount',
    defaultMessage: '{count, plural, =0 {# pack} one {# pack} other {# packs}}',
  },
  desktopManagerSalesDescription: {
    id: 'TransferMarket.Home.desktopManagerSalesDescription',
    defaultMessage:
      'Scout the next superstar and buy player cards directly from other Sorare Managers',
  },
  mobileManagerSalesDescription: {
    id: 'TransferMarket.Home.mobileManagerSalesDescription',
    defaultMessage: 'Buy player cards directly from other Sorare Managers',
  },
  desktopAuctionsDescription: {
    id: 'TransferMarket.Home.desktopAuctionsDescription',
    defaultMessage:
      'Bid on brand new cards in daily live auctions to become their first owner',
  },
  mobileAuctionsDescription: {
    id: 'TransferMarket.Home.mobileAuctionsDescription',
    defaultMessage: 'Bid on brand new cards in daily live auctions',
  },
  primarySecondaryCount: {
    id: 'TransferMarket.Home.primarySecondaryCount',
    defaultMessage: '{count, plural, =0 {# card} one {# card} other {# cards}}',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--triple-unit);
  }
`;

export const Entries = () => {
  const navigate = useNavigate();
  const { setStep, task } = useManagerTaskContext();
  const { up: isTablet } = useScreenSize('tablet');
  const { counts } = useConfigContext();

  return (
    <Root>
      <Entry
        to={FOOTBALL_STARTER_BUNDLES}
        title={transferMarket.starterPacks}
        description={
          isTablet
            ? messages.desktopStarterPacksDescription
            : messages.mobileStarterPacksDescription
        }
        countMessage={messages.starterPacksCount}
        count={counts.football.starterPacksCount}
        mobileImage={<img src={starterPacksMobile} alt="Starter Packs" />}
        desktopImage={<img src={starterPacksDesktop} alt="Starter Packs" />}
      />
      <ManagerTaskTooltip
        name={MarketplaceOnboardingStep.managerSalesLink}
        title={
          <MarketplaceOnboardingTask
            name={MarketplaceOnboardingStep.managerSalesLink}
            onClick={() => {
              navigate(FOOTBALL_TRANSFER_MARKET);
              setStep(MarketplaceOnboardingStep.search);
            }}
          />
        }
        placement="bottom-start"
        disable={!task}
      >
        <Entry
          to={FOOTBALL_TRANSFER_MARKET}
          title={transferMarket.transfer}
          description={
            isTablet
              ? messages.desktopManagerSalesDescription
              : messages.mobileManagerSalesDescription
          }
          countMessage={messages.primarySecondaryCount}
          count={counts.football.managerSalesCount}
          mobileImage={<img src={managerSalesMobile} alt="Manager Sales" />}
          desktopImage={<img src={managerSalesDesktop} alt="Manager Sales" />}
        />
      </ManagerTaskTooltip>
      <Entry
        to={FOOTBALL_NEW_SIGNINGS}
        title={transferMarket.new}
        description={
          isTablet
            ? messages.desktopAuctionsDescription
            : messages.mobileAuctionsDescription
        }
        countMessage={messages.primarySecondaryCount}
        count={counts.football.auctionsCount}
        mobileImage={<img src={auctionsMobile} alt="Auctions" />}
        desktopImage={<img src={auctionsDesktop} alt="Auctions" />}
      />
    </Root>
  );
};
