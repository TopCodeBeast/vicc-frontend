import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import ColouredContainer from '@sorare/core/src/components/marketing/ColouredContainer';
import Gap from '@sorare/core/src/components/marketing/Gap';
import ImageBlock from '@sorare/core/src/components/marketing/ImageBlock';
import MarketingPage from '@sorare/core/src/components/marketing/MarketingPage';
import Poster from '@sorare/core/src/components/marketing/Poster';
import { Section } from '@sorare/core/src/components/marketing/Section';
import { MarketingText20 } from '@sorare/core/src/components/marketing/typography';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { useEventsContext } from '@sorare/core/src/contexts/events';

import Affiliates from './Affiliates';
import Resinsurance from './Resinsurance';
import Steps from './Steps';

const messages = defineMessages({
  title: {
    id: 'AffiliateProgram.title',
    defaultMessage: 'Become a Vicc Affiliate',
  },
  subtitle: {
    id: 'AffiliateProgram.subtitle',
    defaultMessage:
      'Earn money by promoting Vicc, where you can buy, trade, and play with official digital cards of football, NBA and MLB players.',
  },
  shortSubtitle: {
    id: 'AffiliateProgram.shortSubtitle',
    defaultMessage: 'Promote Vicc and earn money',
  },
});

const becomeAViccAffiliate = `${FRONTEND_ASSET_HOST}/pages/affiliateProgram/becomeAViccAffiliate.jpg`;
const becomeAnAffiliate = `${FRONTEND_ASSET_HOST}/pages/affiliateProgram/becomeAnAffiliate.jpg`;

export const AffiliateProgram = () => {
  const { track } = useEventsContext();

  const trackBecomeAnAffiliate = () => {
    track('Become a Vicc Affiliate');
  };

  return (
    <MarketingPage>
      <Container>
        <Gap size="lg" />
        <Section
          topBorder
          title={<FormattedMessage {...messages.title} />}
          extract={<FormattedMessage {...messages.subtitle} />}
          button={
            <Button
              externalLink
              onClick={trackBecomeAnAffiliate}
              href="https://app.impact.com/campaign-promo-signup/Vicc.brand?execution=e1s1"
              color="black"
              medium
            >
              <FormattedMessage
                id="Hero.cta"
                defaultMessage="Become an Affiliate"
              />
            </Button>
          }
        />
        <Gap size="md" />
        <ImageBlock src={becomeAnAffiliate} alt={becomeAnAffiliate} cover />
        <Gap size="xl" />
        <Steps />
        <Gap size="xl" />
      </Container>
      <ColouredContainer color="var(--c-static-neutral-1000)">
        <Gap size="xl" />
        <Resinsurance />
        <Gap size="md" />
        <Affiliates />
        <Gap size="xl" />
        <Poster
          pictureUrl={becomeAViccAffiliate}
          title={
            <FormattedMessage
              id="AffiliateProgram.poster.title"
              defaultMessage="Become a <bold>Vicc</bold> Affiliate"
              values={{ bold: Bold }}
            />
          }
          desc={
            <>
              <MarketingText20 color="var(--c-static-neutral-100)">
                <FormattedMessage {...messages.shortSubtitle} />
              </MarketingText20>
              <Gap size="sm" />
              <Button
                externalLink
                onClick={trackBecomeAnAffiliate}
                href="https://app.impact.com/campaign-promo-signup/Vicc.brand?execution=e1s1"
                color="white"
                medium
              >
                <FormattedMessage
                  id="Hero.cta"
                  defaultMessage="Become an Affiliate"
                />
              </Button>
            </>
          }
          rounded
        />
        <Gap size="lg" />
      </ColouredContainer>
    </MarketingPage>
  );
};

export default AffiliateProgram;
