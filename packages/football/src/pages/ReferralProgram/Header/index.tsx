import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import dotsPattern from '@sorare/core/src/assets/dots-pattern.png';
import Container from '@sorare/core/src/atoms/layout/Container';
import { Text18, Title1 } from '@sorare/core/src/atoms/typography';
import { REFERRAL_HELP } from '@sorare/core/src/constants/externalLinks';
import { socialShareEventContext } from '@sorare/core/src/lib/events';
import { messages } from '@sorare/core/src/lib/referral';
import { theme } from '@sorare/core/src/style/theme';

import InviteFriendsCta from '@sorare/football/src/components/user/InviteFriendsCta';

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
  max-width: 720px;
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
const StyledSpan = styled.span`
  color: var(--c-static-green-300);
`;

export const Header = () => {
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
                  {...messages.subtitle}
                  values={{
                    span: (...chunks: string[]) => {
                      return <StyledSpan>{chunks}</StyledSpan>;
                    },
                  }}
                />
              </Title1>
            </Title>
            <Text18 color="var(--c-neutral-600)">
              <FormattedMessage {...messages.description} />{' '}
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
