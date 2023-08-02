import { Fragment, ReactNode, Suspense } from 'react';
import {
  Navigate,
  Route,
  Routes,
  generatePath,
  useLocation,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Backdrop from '@sorare/core/src/atoms/loader/Backdrop';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { SpecificNews } from '@sorare/core/src/components/activity/SpecificNews';
import {
  ACCEPT_INVITATION,
  ACTIVITY,
  ACTIVITY_NEWS,
  ACTIVITY_NEWS_SHOW,
  AFFILIATE_PROGRAM,
  CAREERS,
  CONFIRM_DEVICE,
  CONFIRM_EMAIL,
  COOKIE_POLICY,
  DEBUG_DEVICE,
  FAQ,
  GAME_RULES,
  INVITE_EPL_USER_GROUP,
  INVITE_USER_GROUP,
  INVITE_WILDCARD,
  LANDING,
  LICENSED_PARTNERS,
  LICENSED_PARTNERS_BY_SPORT,
  LICENSED_PARTNERS_FOOTBALL_TAB,
  LINK,
  LOCKEDON,
  MLB_LOCKEDON,
  MOBILE_SIGN_UP,
  MY_SORARE_HOME,
  MY_SORARE_NEW,
  MY_SORARE_WILDCARD,
  OAUTH_AUTORIZE,
  PRESS,
  PRIVACY_POLICY,
  PROMO_CLAIM,
  PROMO_SIGNUP,
  REFERRER_LINK,
  SETTINGS_ACCOUNT,
  SETTINGS_HOME,
  SETTINGS_WILDCARD,
  TERMS,
  VERIFY_STRIPE_ACCOUNT,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useGetSplat from '@sorare/core/src/hooks/useGetSplat';
import { Lifecycle } from '@sorare/core/src/hooks/useLifecycle';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import {
  SESSION_STORAGE,
  useSessionStorage,
} from '@sorare/core/src/hooks/useSessionStorage';
import { lazy } from '@sorare/core/src/lib/retry';
import { DarkTheme } from '@sorare/core/src/routing/DarkTheme';
import { EnsureTopVisibleOnMount } from '@sorare/core/src/routing/EnsureTopVisibleOnMount';
import RequireAuth from '@sorare/core/src/routing/RequireAuth';
import { RoutesWithDialogs } from '@sorare/core/src/routing/Router';

import { AppLayout } from '@sorare/us-sports/src/components/AppLayout';

import { metadata as eplMetadata } from '@sorare/football/src/pages/EPLLanding';
import Landing from '@sorare/shared-pages/src/Landing';
import AppProviders from 'AppProviders';
import RedirectRouter from 'RedirectRouter';

const Activity = lazy(async () => import('@sorare/shared-pages/src/Activity'));
const Careers = lazy(async () => import('@sorare/shared-pages/src/Careers'));
const LicensedPartners = lazy(
  async () => import('@sorare/shared-pages/src/LicensedPartners')
);
const AffiliateProgram = lazy(
  async () => import('@sorare/shared-pages/src/AffiliateProgram')
);
const Dialog = lazy(
  async () => import('@sorare/core/src/components/dialog/index')
);
const WalletDrawer = lazy(
  async () => import('@sorare/core/src/components/wallet/WalletDrawer')
);
const Press = lazy(async () => import('@sorare/shared-pages/src/Press'));
const BlockchainProvider = lazy(
  async () => import('@sorare/core/src/contexts/blockchain/Provider')
);
const Web3Provider = lazy(
  async () => import('@sorare/core/src/contexts/web3/Provider')
);

const ConfirmDevice = lazy(
  async () => import('@sorare/shared-pages/src/ConfirmDevice')
);
const ConfirmEmail = lazy(
  async () => import('@sorare/shared-pages/src/ConfirmEmail')
);
const Redirect = lazy(async () => import('@sorare/shared-pages/src/Link'));
const DebugDevice = lazy(
  async () => import('@sorare/shared-pages/src/DebugDevice')
);

const MobileSignUp = lazy(
  async () => import('@sorare/shared-pages/src/MobileSignUp')
);
const PrivacyPolicy = lazy(
  async () => import('@sorare/shared-pages/src/PrivacyPolicy')
);
const CookiePolicy = lazy(
  async () => import('@sorare/shared-pages/src/CookiePolicy')
);
const Terms = lazy(async () => import('@sorare/shared-pages/src/Terms'));

const OAuth = lazy(async () => import('@sorare/shared-pages/src/OAuth'));

const GameRules = lazy(
  async () => import('@sorare/shared-pages/src/GameRules')
);
const VerifyIdentity = lazy(
  async () => import('@sorare/shared-pages/src/VerifyIdentity')
);
const PromoSignup = lazy(
  async () => import('@sorare/shared-pages/src/PromoSignup')
);
const PromoClaim = lazy(
  async () => import('@sorare/shared-pages/src/PromoClaim')
);
const MySorare = lazy(async () => import('@sorare/shared-pages/src/MySorare'));
const Settings = lazy(async () => import('@sorare/shared-pages/src/Settings'));
const ReferralProgram = lazy(
  async () => import('@sorare/football/src/pages/ReferralProgram')
);
const PrivateRoute = lazy(
  async () => import('@sorare/football/src/routing/PrivateRoute')
);
const PrivateUserGroupInviteLinkEntryPoint = lazy(
  async () =>
    import(
      '@sorare/football/src/components/userGroup/private/InviteLinkEntryPoint'
    )
);
const BaseballRoot = lazy(async () => import('@sorare/baseball/src/main'));
const FootballRoot = lazy(async () => import('@sorare/football/src/main'));
const NBARoot = lazy(async () => import('@sorare/nba/src/main'));

export const BlockchainProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingIndicator fullHeight />}>
      <Web3Provider>
        <BlockchainProvider>
          {children}
          <WalletDrawer />
        </BlockchainProvider>
      </Web3Provider>
    </Suspense>
  );
};

const FAQRedirect = () => {
  const selection = useQueryString('selection');
  return (
    <Navigate
      replace
      to={
        selection === 'Coverage'
          ? generatePath(LICENSED_PARTNERS_FOOTBALL_TAB, {
              tab: 'competitions',
            })
          : LICENSED_PARTNERS
      }
    />
  );
};

const AppsRouter = () => {
  const bgLocation = useBgLocation();
  const location = useLocation();
  const getSplat = useGetSplat();
  return (
    <Routes location={bgLocation}>
      <Route path="/nba/*" element={<NBARoot />} />
      <Route path={'/mlb/*'} element={<BaseballRoot />} />
      <Route path={'/football/*'} element={<FootballRoot />} />
      {/* Force all Football routes to be prefixed with /football now */}
      <Route
        path={'/*'}
        element={
          <Navigate
            to={getSplat('/*', '/football/*') + location.search}
            replace
          />
        }
      />
    </Routes>
  );
};

// Here we are trying to include the blockchain providers only when needed, and only once
// It is not needed on the Logged out Landing page
// It is not needed on the Logged in Landing page
// It is needed on the logged out Football Player page (for instance)
export const Router = ({ appRoutes }: { appRoutes: ReactNode }) => {
  const { currentUser } = useCurrentUserContext();
  const activityNewsOnClose = useSafePreviousNavigate(ACTIVITY);

  const { getValue: getSport } = useSessionStorage(SESSION_STORAGE.sport);
  const sessionSport = getSport();
  const sport =
    sessionSport ||
    (currentUser?.userSettings?.lifecycle as Lifecycle)?.lastVisitedSport;

  const SharedPagesTheme = sport === Sport.FOOTBALL ? DarkTheme : Fragment;

  return (
    <>
      <RedirectRouter />
      <RoutesWithDialogs
        basePath="/"
        dialogRoutes={({ isDialog }) => (
          <Route
            path={ACTIVITY_NEWS_SHOW}
            element={
              isDialog ? (
                <Suspense fallback={<Backdrop />}>
                  <Dialog
                    open
                    fullWidth
                    maxWidth="sm"
                    onClose={() => activityNewsOnClose()}
                  >
                    <SpecificNews />
                  </Dialog>
                </Suspense>
              ) : (
                <DarkTheme>
                  <AppLayout>
                    <SpecificNews />
                  </AppLayout>
                </DarkTheme>
              )
            }
          />
        )}
      >
        <Route path={LANDING} element={<Landing />} />
        <Route
          path={AFFILIATE_PROGRAM}
          element={
            <AppLayout>
              <AffiliateProgram />
            </AppLayout>
          }
        />
        <Route
          path={PRESS}
          element={
            <AppLayout>
              <Press />
            </AppLayout>
          }
        />
        {[
          LICENSED_PARTNERS,
          LICENSED_PARTNERS_BY_SPORT,
          LICENSED_PARTNERS_FOOTBALL_TAB,
        ].map(path => (
          <Route
            key={path}
            path={path}
            element={
              <DarkTheme>
                <LicensedPartners />
              </DarkTheme>
            }
          />
        ))}
        <Route path={FAQ} element={<FAQRedirect />} />
        <Route
          path={CAREERS}
          element={
            <AppLayout>
              <Careers />
            </AppLayout>
          }
        />
        <Route path={GAME_RULES} element={<GameRules />} />
        <Route path={ACCEPT_INVITATION} element={<Landing />} />
        <Route path={REFERRER_LINK} element={<Landing />} />
        <Route path={MOBILE_SIGN_UP} element={<MobileSignUp />} />
        <Route path={TERMS} element={<Terms />} />
        <Route path={PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={COOKIE_POLICY} element={<CookiePolicy />} />
        <Route path={CONFIRM_EMAIL} element={<ConfirmEmail />} />
        <Route path={LINK} element={<Redirect />} />
        <Route path={CONFIRM_DEVICE} element={<ConfirmDevice />} />
        <Route
          path={VERIFY_STRIPE_ACCOUNT}
          element={
            <AppLayout>
              <DarkTheme>
                <VerifyIdentity />
              </DarkTheme>
            </AppLayout>
          }
        />
        <Route path={DEBUG_DEVICE} element={<DebugDevice />} />
        <Route
          path={OAUTH_AUTORIZE}
          element={
            <RequireAuth>
              <OAuth />
            </RequireAuth>
          }
        />
        <Route
          path={SETTINGS_HOME}
          element={
            <EnsureTopVisibleOnMount>
              <Navigate to={SETTINGS_ACCOUNT} replace />
            </EnsureTopVisibleOnMount>
          }
        />
        <Route
          path={ACTIVITY}
          element={
            <RequireAuth>
              <SharedPagesTheme>
                <Activity tab="notifications" />
              </SharedPagesTheme>
            </RequireAuth>
          }
        />
        <Route
          path={ACTIVITY_NEWS}
          element={
            <SharedPagesTheme>
              <Activity tab="news" />
            </SharedPagesTheme>
          }
        />
        <Route
          path={INVITE_USER_GROUP}
          element={
            <DarkTheme>
              <PrivateUserGroupInviteLinkEntryPoint />
            </DarkTheme>
          }
        />
        <Route
          path={INVITE_EPL_USER_GROUP}
          element={
            <DarkTheme>
              <PrivateUserGroupInviteLinkEntryPoint metadata={eplMetadata} />
            </DarkTheme>
          }
        />
        <Route
          path={INVITE_WILDCARD}
          element={
            <PrivateRoute
              element={
                <DarkTheme>
                  <EnsureTopVisibleOnMount>
                    <ReferralProgram />
                  </EnsureTopVisibleOnMount>
                </DarkTheme>
              }
              withLayout
              requireVerifiedPhoneNumber
            />
          }
        />

        <Route
          path={SETTINGS_WILDCARD}
          element={
            <RequireAuth>
              <SharedPagesTheme>
                <EnsureTopVisibleOnMount>
                  <Settings />
                </EnsureTopVisibleOnMount>
              </SharedPagesTheme>
            </RequireAuth>
          }
        />
        <Route
          path={MY_SORARE_HOME}
          element={<Navigate to={MY_SORARE_NEW} replace />}
        />
        <Route
          path={MY_SORARE_WILDCARD}
          element={
            <RequireAuth>
              <SharedPagesTheme>
                <MySorare />
              </SharedPagesTheme>
            </RequireAuth>
          }
        />
        <Route path={PROMO_SIGNUP} element={<PromoSignup />} />
        <Route
          path={PROMO_CLAIM}
          element={
            <RequireAuth>
              <PromoClaim />
            </RequireAuth>
          }
        />
        <Route
          path={'/*'}
          element={
            currentUser ? (
              appRoutes
            ) : (
              <BlockchainProviders>{appRoutes}</BlockchainProviders>
            )
          }
        />
        <Route
          path={LOCKEDON}
          element={<Navigate to={MLB_LOCKEDON} replace />}
        />
      </RoutesWithDialogs>
    </>
  );
};

const SmartRouter = () => {
  const { currentUser } = useCurrentUserContext();

  return currentUser ? (
    <BlockchainProviders>
      <Router appRoutes={<AppsRouter />} />
    </BlockchainProviders>
  ) : (
    <Router appRoutes={<AppsRouter />} />
  );
};

const GlobalBackground = createGlobalStyle`
  body {
    background-color: var(--c-neutral-100);
    color: var(--c-neutral-1000);
  }
  `;

const AppRouter = ({ isReorgApp }: { isReorgApp?: boolean }) => {
  return (
    <>
      {isReorgApp && <GlobalBackground />}
      <AppProviders isReorgApp={isReorgApp}>
        <SmartRouter />
      </AppProviders>
    </>
  );
};

export default AppRouter;
