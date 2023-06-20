import qs from 'qs';
import { useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { randomUUID } from '@sorare/core/src/lib/uuid';

import { IMPACT_PAGE_LOAD_API_URL } from '../../config';
import {
  QSKey,
  storageFactory,
} from '../PersistsQueryStringParameters/storage';

const IMPACT_CAMPAIGN_ID = 12209;

const utmCampaignParam: QSKey = 'utm_campaign';
const impactClickIdParam: QSKey = 'irclickid';

const customProfileLSKey = 'CUSTOM_PROFILE_ID';
const impactClickIdLSKey = 'IMPACT_CLICKID';

const ResolveImpactClickId = () => {
  const [searchParams] = useSearchParams();
  const storage = useRef(storageFactory());
  const { currentUser } = useCurrentUserContext() || {};

  useLayoutEffect(() => {
    if (!IMPACT_PAGE_LOAD_API_URL) {
      // env not configured
      return;
    }

    if (
      searchParams.get(impactClickIdParam) ||
      !searchParams.get(utmCampaignParam)?.match(/^[0-9]+$/)
    ) {
      // only calls Impact if there is a utm_campaign that looks like a MediaPartnerID and no clickid,
      return;
    }

    if (!storage.current.get(customProfileLSKey)) {
      storage.current.set(customProfileLSKey, randomUUID());
    }

    fetch(IMPACT_PAGE_LOAD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        CampaignId: IMPACT_CAMPAIGN_ID,
        PageUrl: window.location.href,
        ReferringUrl: document.referrer,
        EventDate: 'NOW',
        CustomProfileId: storage.current.get(customProfileLSKey),
        ...(currentUser?.id && {
          CustomerId: idFromObject(currentUser.id),
          CustomerEmail: '',
        }),
      }),
    })
      .then(async response => {
        if (response.ok) {
          const json = await response.json();
          if (json.clickId) {
            storage.current.set(impactClickIdLSKey, json.clickId);
          }
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, [currentUser?.id, searchParams]);

  return null;
};

export default ResolveImpactClickId;
