import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { metadatas } from '@sorare/core/src/lib/seo/football';

import PageTemplate from '@sorare/football/src/pages/TransferMarket/PageTemplate';

import { Entries } from './Entries';
import { Trends } from './Trends';

const StyledTitle2 = styled(Title2)`
  margin-bottom: var(--triple-unit);
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(6 * var(--unit));
`;

export const Home = () => {
  const {
    flags: { useFootballMarketTrends = false },
  } = useFeatureFlags();

  useTitleAndDescription(metadatas.market.title, metadatas.market.description);

  return (
    <>
      <ConversionCreditBanner />
      <PageTemplate>
        <StyledTitle2 color="var(--c-neutral-1000)">
          <FormattedMessage {...transferMarket.buySellAndTradeCards} />
        </StyledTitle2>
        <Section>
          <Entries />
          {useFootballMarketTrends && <Trends />}
        </Section>
      </PageTemplate>
    </>
  );
};

export default Home;
