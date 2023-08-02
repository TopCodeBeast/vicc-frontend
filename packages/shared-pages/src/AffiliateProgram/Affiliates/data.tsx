import { FormattedMessage } from 'react-intl';

import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';

export const affiliates = [
  {
    name: 'John Nellis',
    role: (
      <FormattedMessage
        id="AffiliateProgram.nellis.role"
        defaultMessage="Football"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/affiliateProgram/johnNellis.png`,
    href: 'https://www.youtube.com/watch?v=ylM0blE491Y',
  },
  {
    name: 'Frank Michael Smith',
    role: (
      <FormattedMessage id="AffiliateProgram.smith.role" defaultMessage="MLB" />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/affiliateProgram/frankMichaelSmith.png`,
    href: 'https://www.youtube.com/shorts/ymajkVK3QQ8',
  },
  {
    name: 'TeamHold!',
    role: (
      <FormattedMessage
        id="AffiliateProgram.teamHold.role"
        defaultMessage="NBA"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/affiliateProgram/teamHold.png`,
    href: 'https://www.youtube.com/watch?v=JLMTLSi2vdQ',
  },
  {
    name: 'Coin Bureau',
    role: (
      <FormattedMessage
        id="AffiliateProgram.coinBureau.role"
        defaultMessage="Web3"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/affiliateProgram/coinBureau.png`,
    href: 'https://www.youtube.com/watch?v=a7iMDUfRlgs',
  },
];
