import { faGavel } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/MarketplaceOnboardingTask';
import {
  FOOTBALL_MARKET_STARTER_PACKS,
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_TRANSFER_MARKET,
  MY_SORARE_HOME,
} from '@sorare/core/src/constants/routes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import useUsersCount from '@sorare/core/src/hooks/config/useUsersCount';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { navLabels, transferMarket } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import auctionsDesktop from '@football/pages/TransferMarket/assets/auctions_desktop.jpg';
import auctionsMobile from '@football/pages/TransferMarket/assets/auctions_mobile.jpg';
import managerSalesDesktop from '@football/pages/TransferMarket/assets/manager_sales_desktop.jpg';
import managerSalesMobile from '@football/pages/TransferMarket/assets/manager_sales_mobile.jpg';
import starterPacksDesktop from '@football/pages/TransferMarket/assets/starter_packs_desktop.jpg';
import starterPacksMobile from '@football/pages/TransferMarket/assets/starter_packs_mobile.jpg';

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
  mySorareDescription: {
    id: 'TransferMarket.Home.mySorareDescription',
    defaultMessage: 'Manage my sales',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--triple-unit);
  }
`;

const MySorareImage = styled.div`
  padding: calc(6 * var(--unit)) var(--double-unit);
`;
export const Entries = () => {
  const { counts } = useUsersCount();
  const navigate = useNavigate();
  const { setStep, task } = useManagerTaskContext();
  const { up: isTablet } = useScreenSize('tablet');
  const isReorgApp = useIsReorgApp();
  return (
    <Root>
      <Entry
        to={FOOTBALL_NEW_SIGNINGS}
        title={transferMarket.new}
        description={
          isTablet
            ? messages.desktopAuctionsDescription
            : messages.mobileAuctionsDescription
        }
        countMessage={messages.primarySecondaryCount}
        count={counts.auctionsCount}
        mobileImage={<img src={auctionsMobile} alt="Auctions" />}
        desktopImage={<img src={auctionsDesktop} alt="Auctions" />}
      />
      <Entry
        to={FOOTBALL_MARKET_STARTER_PACKS}
        title={transferMarket.starterPacks}
        description={
          isTablet
            ? messages.desktopStarterPacksDescription
            : messages.mobileStarterPacksDescription
        }
        countMessage={messages.starterPacksCount}
        count={counts.starterPacksCount}
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
          count={counts.managerSalesCount}
          mobileImage={<img src={managerSalesMobile} alt="Manager Sales" />}
          desktopImage={<img src={managerSalesDesktop} alt="Manager Sales" />}
        />
      </ManagerTaskTooltip>
      {isReorgApp && (
        <Entry
          to={MY_SORARE_HOME}
          title={navLabels.myMarketActivity}
          description={messages.mySorareDescription}
          desktopImage={
            <MySorareImage>
              <FontAwesomeIcon icon={faGavel} size="4x" />
            </MySorareImage>
          }
          mobileImage={
            <MySorareImage>
              <FontAwesomeIcon icon={faGavel} size="4x" />
            </MySorareImage>
          }
        />
      )}
    </Root>
  );
};
