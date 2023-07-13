// import { ConsentManagerBuilder } from '@segment/consent-manager';
// import inEU from '@segment/in-eu';

import { Popup } from '@core/atoms/layout/Popup';
import { COOKIE_POLICY } from '@core/constants/routes';
import useToggle from '@core/hooks/useToggle';

import { SEGMENT_API_KEY } from '../../../config';
import { DetailedConsent, SimpleConsent } from './Consent';

declare global {
  interface Window {
    segmentApiKey: string;
  }
}
type Props = {
  force?: boolean;
};
const CookieConsentBanner = ({ force = false }: Props) => {
  const [detailsOpened, toggleDetails] = useToggle(false);

  if (!SEGMENT_API_KEY) {
    return null;
  }
  // cant use react router as it's not loaded yet
  if (window.location.pathname.startsWith(COOKIE_POLICY)) {
    // hide banner to allow user to read policy
    return null;
  }

  return <>ConsentManagerBuilder</>
  /*return (
    <ConsentManagerBuilder
      writeKey={SEGMENT_API_KEY}
      shouldRequireConsent={inEU}
      // 6 month (but safari limits it to 7 days)
      cookieExpires={183}
    >
      {args => {
        const {
          isConsentRequired,
          destinations,
          newDestinations,
          preferences,
          setPreferences,
          saveConsent,
        } = args;
        if (!force && (newDestinations.length === 0 || !isConsentRequired)) {
          // ConsentManagerBuilder requires a non null return value :/
          return <div />;
        }
        const setAll = (v: boolean) => {
          setPreferences(Object.fromEntries(destinations.map(d => [d.id, v])));
        };

        // Fix issue with default save
        //  https://github.com/segmentio/consent-manager/issues/92
        const FixedSaveConsent = (value?: boolean) => {
          if (value !== undefined) {
            setAll(value);
          }
          saveConsent();
        };
        return (
          <Popup>
            {detailsOpened ? (
              <DetailedConsent
                {...{
                  destinations,
                  preferences,
                  setPreferences,
                  saveConsent: FixedSaveConsent,
                }}
              />
            ) : (
              <SimpleConsent
                saveConsent={FixedSaveConsent}
                seeDetails={() => {
                  setAll(true);
                  toggleDetails();
                }}
              />
            )}
          </Popup>
        );
      }}
    </ConsentManagerBuilder>
  );*/
};
export default CookieConsentBanner;
