import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import MyReferees from '@sorare/core/src/components/referral/MyReferees';
import Notice from '@sorare/core/src/components/referral/Notice';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import ReferralBar from '@football/components/user/ReferralBar';

import Header from './Header';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  color: var(--c-neutral-1000);
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    flex-direction: row;
    gap: calc(5 * var(--unit));
  }
`;
const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    width: 360px;
  }
`;

export const ReferralProgram = () => (
  <>
    <Header />
    <Container>
      <Root>
        <ReferralBar context="invite" />
        <Main>
          <Body>
            <Notice />
          </Body>
          <Aside>
            <MyReferees />
          </Aside>
        </Main>
      </Root>
    </Container>
  </>
);

export default ReferralProgram;
