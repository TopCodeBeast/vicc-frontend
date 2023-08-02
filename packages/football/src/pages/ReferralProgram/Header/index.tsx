import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import dotsPattern from '@sorare/core/src/assets/dots-pattern.png';
import Container from '@sorare/core/src/atoms/layout/Container';
import { Text18, Title1 } from '@sorare/core/src/atoms/typography';
import { REFERRAL_HELP } from '@sorare/core/src/constants/externalLinks';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { socialShareEventContext } from '@sorare/core/src/lib/events';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import InviteFriendsCta from '@football/components/user/InviteFriendsCta';

const messages = defineMessages({
  title: {
    id: 'Referral.title',
    defaultMessage: 'Invite a friend to Sorare',
  },
  subtitle: {
    id: 'Referral.subtitle',
    defaultMessage: "You'll both get a <span>free card</span>",
  },
  conversionCreditSubtitle: {
    id: 'Referral.conversionCreditSubtitle',
    defaultMessage: "You'll get up to <span>{amount} in credits</span>",
  },
  description: {
    id: 'Referral.description',
    defaultMessage:
      'When your friend collects 5 cards via new card auctions or a starter pack in their first 30 days on Sorare, you’ll both win a free card.',
  },
  conversionCreditDescription: {
    id: 'Referral.conversionCreditDescription',
    defaultMessage:
      'When your friend collects 5 cards via new card auctions or a starter pack in his first 30 days on Sorare, you’ll win a 50% discount credit applicable to auctions and starter packs purchases up to {amount}',
  },
});

const Root = styled.div`
  padding: calc(8 * var(--unit)) 0;
  position: relative;
  color: var(--c-neutral-1000);
  background: url(${dotsPattern}), #181818;
  background-repeat: no-repeat;
  background-size: cover;

  & > * {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    inset: 0;
    position: absolute;
    z-index: 0;
    background: linear-gradient(
      180deg,
      #0d0c11 0%,
      rgba(13, 12, 17, 0) 40.48%,
      #0d0c11 100%
    );
  }
`;
const StyledContainer = styled.div`
  display: flex;
  max-width: 960px;
  margin: 0 auto;
`;
const LeftContent = styled.div`
  display: flex;
  max-width: 100%;
  flex-direction: column;
  gap: 20px;
  text-align: center;
`;
const ShareContainer = styled.div`
  width: 100%;
  margin: auto;
  @media ${tabletAndAbove} {
    width: 540px;
  }
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 38px;
`;
const StyledLink = styled.a`
  color: inherit;
  text-decoration: underline;
`;
const GreenSpan = styled.span`
  color: var(--c-static-green-300);
`;
const YellowSpan = styled.span`
  color: var(--c-static-yellow-300);
`;

export const Header = () => {
  const { fiatCurrency } = useCurrentUserContext();
  const { formatNumber } = useIntlContext();
  const {
    flags: { abTestUseConversionCreditForReferrerReward = false },
  } = useFeatureFlags();

  const formattedConversionCreditAmount = formatNumber(20, {
    style: 'currency',
    currency: fiatCurrency.code,
    maximumFractionDigits: 0,
  });

  return (
    <Root>
      <Container>
        <StyledContainer>
          <LeftContent>
            <Title>
              <Title1 as="h2">
                <FormattedMessage {...messages.title} />
                <br />
                <FormattedMessage
                  {...(abTestUseConversionCreditForReferrerReward
                    ? messages.conversionCreditSubtitle
                    : messages.subtitle)}
                  values={{
                    amount: formattedConversionCreditAmount,
                    span: (...chunks: string[]) => {
                      return abTestUseConversionCreditForReferrerReward ? (
                        <YellowSpan>{chunks}</YellowSpan>
                      ) : (
                        <GreenSpan>{chunks}</GreenSpan>
                      );
                    },
                  }}
                />
              </Title1>
            </Title>
            <Text18 color="var(--c-neutral-600)">
              <FormattedMessage
                {...(abTestUseConversionCreditForReferrerReward
                  ? messages.conversionCreditDescription
                  : messages.description)}
                values={{
                  amount: formattedConversionCreditAmount,
                }}
              />{' '}
              <StyledLink
                href={REFERRAL_HELP}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage
                  id="ReferralProgram.Header.learnMore"
                  defaultMessage="Learn more"
                />
              </StyledLink>
            </Text18>
            <ShareContainer>
              <InviteFriendsCta
                source={socialShareEventContext.REFERRAL_PROGRAM}
              />
            </ShareContainer>
          </LeftContent>
        </StyledContainer>
      </Container>
    </Root>
  );
};

export default Header;
