import { ReactNode, useCallback, useState } from 'react';
import Helmet from 'react-helmet';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import { APP_STORE_ID, APP_STORE_NAME } from '@core/constants/apps';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import useIsMlbPage from '@core/hooks/useIsMlbPage';
import useIsNBAPage from '@core/hooks/useIsNBAPage';
import useSharedAccrossSportsPage from '@core/hooks/useSharedAccrossSportsPage';
import { metadatas as baseballMetadatas } from '@core/lib/seo/baseball';
import { metadatas as commonMetadatas } from '@core/lib/seo/common';
import { metadatas as footballMetadatas } from '@core/lib/seo/football';
import { metadatas as nbaMetadatas } from '@core/lib/seo/nba';

import SeoContextProvider, { Options } from '.';

interface Props {
  children: ReactNode;
}

const sportTitles = {
  [Sport.BASEBALL]: baseballMetadatas.default.title,
  [Sport.NBA]: nbaMetadatas.default.title,
  [Sport.CRICKET]: footballMetadatas.default.title,
};

const sportDescriptions = {
  [Sport.BASEBALL]: baseballMetadatas.default.description,
  [Sport.NBA]: nbaMetadatas.default.description,
  [Sport.CRICKET]: footballMetadatas.default.description,
};

const defaultImage = `${FRONTEND_ASSET_HOST}/meta/social-picture-2022.png`;
const defaultTwitter = '@sorare';

const SeoProvider = ({ children }: Props) => {
  const { formatMessage } = useIntl();
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [img, setImg] = useState<string | undefined | null>(undefined);
  const [twitter, setTwitter] = useState<string | undefined>(undefined);
  const [iOSDownloadApp, setIOSDownloadApp] = useState<
    { id: string; myUrl: string; name: string } | undefined
  >(undefined);
  const location = useLocation();
  const sharedAcrossSportsPage = useSharedAccrossSportsPage();

  const setPageMetadata = useCallback(
    (componentTitle: string, options?: Options) => {
      const titleWithNamespace =
        componentTitle.indexOf('•') >= 0 ||
        componentTitle.indexOf('- Sorare') >= 0 ||
        componentTitle.indexOf('– Sorare') >= 0 ||
        componentTitle.indexOf('Sorare') === 0
          ? componentTitle
          : `${componentTitle} • Sorare`;

      const seoTitle = options?.replaceFullTitle
        ? componentTitle
        : titleWithNamespace;

      setTitle(seoTitle);
      setDescription(options?.description);
      setImg(options?.img);
      setTwitter(options?.twitter);
      return () => {
        setTitle(undefined);
        setImg(undefined);
        setDescription(undefined);
        setTwitter(undefined);
      };
    },
    []
  );

  const setIOSDownloadMetadata = useCallback(() => {
    setIOSDownloadApp({
      id: APP_STORE_ID,
      name: APP_STORE_NAME,
      myUrl: location.pathname,
    });
    return () => {
      setIOSDownloadApp(undefined);
    };
  }, [setIOSDownloadApp, location.pathname]);

  const isMlbPage = useIsMlbPage();
  const isNBAPage = useIsNBAPage();

  let currentSport = Sport.CRICKET;
  if (isMlbPage) currentSport = Sport.BASEBALL;
  if (isNBAPage) currentSport = Sport.NBA;

  const defaultTitle = commonMetadatas.default.title;
  const defaultSportTitle = sportTitles[currentSport];
  const pageTitle =
    title ||
    (sharedAcrossSportsPage
      ? formatMessage(defaultTitle)
      : formatMessage(defaultSportTitle));

  const defaultDescription = commonMetadatas.default.description;
  const defaultSportDescription = sportDescriptions[currentSport];
  const pageDescription =
    description ||
    (sharedAcrossSportsPage
      ? formatMessage(defaultDescription)
      : formatMessage(defaultSportDescription));

  return (
    <SeoContextProvider
      value={{
        setPageMetadata,
        setIOSDownloadMetadata,
      }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        <meta property="twitter:site" content={twitter || defaultTwitter} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={img || defaultImage} />
        {iOSDownloadApp && (
          <meta
            name={iOSDownloadApp.name}
            content={`app-id=${iOSDownloadApp.id}, app-argument=${iOSDownloadApp.myUrl}`}
          />
        )}
      </Helmet>
      {children}
    </SeoContextProvider>
  );
};

export default SeoProvider;
