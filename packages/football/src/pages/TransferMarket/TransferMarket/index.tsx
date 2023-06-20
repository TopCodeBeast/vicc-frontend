import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { transferMarket } from '@sorare/core/src/lib/glossary';

import AdvancedCardSearch from '@sorare/football/src/components/searchCards/AdvancedCardSearch';
import PageTemplate from '@sorare/football/src/pages/TransferMarket/PageTemplate';
import { SelectedLeaderboardBanner } from '@sorare/football/src/pages/TransferMarket/SelectedLeaderboardBanner';

const TransferMarket = () => {  
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(true);
  const [forceShowOnboardingDialog, setForceShowOnboardingDialog] = useState(false);

  return (
    <PageTemplate>
      <AdvancedCardSearch
        title={
          <>
            <Title2>
              <FormattedMessage {...transferMarket.transfer} />
            </Title2>
            <FontAwesomeIcon
              onClick={() => {
                setForceShowOnboardingDialog(true);
              }}
              icon={faInfoCircle}
            />
          </>
        }
        stackable
        banner={<SelectedLeaderboardBanner />}
      />
    </PageTemplate>
  );
};

export default TransferMarket;
