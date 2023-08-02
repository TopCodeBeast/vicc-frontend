import {
  faChartLineUp,
  faEarthAmericas,
  faMessageBot,
  faSackDollar,
} from '@fortawesome/pro-regular-svg-icons';
import { FormattedMessage } from 'react-intl';

export const resinsurances = [
  {
    icon: faMessageBot,
    title: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance1Title"
        defaultMessage="Dedicated account manager"
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance1Subitle"
        defaultMessage="Get individual support with any inquiries you might have. Set-up, best practices, you name it – we’re here to help."
      />
    ),
  },
  {
    icon: faChartLineUp,
    title: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance2Title"
        defaultMessage="High conversion rate"
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance2Subtitle"
        defaultMessage="Our trusted brand & effective promo material means the traffic you send to Sorare will convert!"
      />
    ),
  },
  {
    icon: faSackDollar,
    title: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance3Title"
        defaultMessage="Generous commissions"
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance3Subtitle"
        defaultMessage="We set competitive commission rates for all purchases you bring."
      />
    ),
  },
  {
    icon: faEarthAmericas,
    title: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance4Title"
        defaultMessage="We convert all geos & types of traffic."
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.resinsurance4Subtitle"
        defaultMessage="We take it all and convert into revenue for you. We offer global campaigns, so the world is your customer base."
      />
    ),
  },
];
