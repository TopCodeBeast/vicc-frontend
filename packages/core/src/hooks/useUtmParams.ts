import qs from 'qs';
import { useMemo } from 'react';

import { getValue } from '@core/components/PersistsQueryStringParameters/storage';

import { Sport, UtmInput } from '../__generated__/globalTypes';

export enum UTM_SOURCES {
  TWITTER = 'twitter',
  WHATSAPP = 'whatsapp',
  FACEBOOK = 'facebook',
}
export enum UTM_CAMPAIGNS {
  LINEUP = 'sharing_lineup',
}
export enum UTM_MEDIUMS {
  SOCIAL = 'social',
}
export enum UTM_TERMS {
  FOOTBALL = 'football',
  BASEBALL = 'baseball',
  NBA = 'nba',
}

export function getUtmTermFromSport(sport?: Sport): UTM_TERMS {
  switch (sport) {
    case Sport.BASEBALL:
      return UTM_TERMS.BASEBALL;
    case Sport.NBA:
      return UTM_TERMS.NBA;
    default:
    case Sport.CRICKET:
      return UTM_TERMS.FOOTBALL;
  }
}

type UtmParams = {
  url?: string;
  source?: UTM_SOURCES;
  content?: string;
  medium?: UTM_MEDIUMS;
  campaign?: UTM_CAMPAIGNS;
  term?: UTM_TERMS;
  user?: string;
};

const useUtmParams = () => {
  const getParams = useMemo(() => {
    const params: UtmInput = {
      utmCampaign: getValue('utm_campaign'),
      utmContent: getValue('utm_content'),
      utmMedium: getValue('utm_medium'),
      utmSource: getValue('utm_source'),
      utmTerm: getValue('utm_term'),
      trafficCategory: getValue('traffic_category'),
      partner: getValue('partner'),
      user: getValue('user'),
    };
    return params;
  }, []);

  const setParams = ({
    url,
    source,
    content,
    medium,
    term,
    campaign,
    user,
  }: UtmParams) => {
    if (!url) {
      return '';
    }
    const [baseUrl, queryParams] = url.split('?');
    const parsedQs = qs.parse(queryParams);
    return `${baseUrl}?${qs.stringify({
      ...parsedQs,
      utm_campaign: campaign,
      utm_source: source,
      utm_content: content,
      utm_medium: medium,
      utm_term: term,
      user,
    })}`;
  };

  return { getParams, setParams };
};

export default useUtmParams;
