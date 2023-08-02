import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import ClubShopButton from '@sorare/core/src/components/clubShop/ClubShopButton';
import CoinAmount from '@sorare/core/src/components/clubShop/CoinAmount';
import {
  FOOTBALL_CLUB_SHOP,
  FOOTBALL_HOME,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import OnboardingDialog from '@football/pages/ClubShop/OnboardingDialog';

import bannerBg from './assets/banner.png';

const Root = styled(Container)`
  background: no-repeat top center url(${bannerBg});
  padding: 0 var(--unit) var(--triple-unit) var(--unit);
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media ${tabletAndAbove} {
    align-items: stretch;
    padding: var(--unit);
  }
  @media ${laptopAndAbove} {
    align-items: stretch;
    padding: var(--unit) 0;
  }
`;
const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: var(--unit) 0;
`;
const BackButtonWrapper = styled.div`
  display: block;
  @media ${tabletAndAbove} {
    display: none;
  }
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 var(--unit);
  gap: var(--double-unit);

  @media ${tabletAndAbove} {
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinBalanceCol = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: var(--double-unit);
  justify-content: flex-end;

  @media ${tabletAndAbove} {
    display: inline-flex;
    flex-direction: column;
    gap: var(--unit);
    align-items: flex-end;
  }
`;

const UnderlinedText = styled(Text14)`
  text-decoration: underline;
`;

const Header = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { currentUser } = useCurrentUserContext();
  const onGoBack = useSafePreviousNavigate(FOOTBALL_HOME);

  return (
    <>
      <Root>
        <MainContainer>
          <NavigationBar>
            <BackButtonWrapper>
              <Button medium color="white" onClick={onGoBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
            </BackButtonWrapper>
          </NavigationBar>

          <FlexContainer>
            <Col>
              <Title2 color="var(--c-neutral-1000)">
                <FormattedMessage
                  id="ClubShop.Header.Title"
                  defaultMessage="The Club Shop"
                />
              </Title2>
              <Text14 color="var(--c-neutral-600)">
                <FormattedMessage
                  id="ClubShop.Header.Subtitle"
                  defaultMessage="Redeem Coins to customize your profile, improve your cards, get tickets, merch, and more!"
                />
              </Text14>
            </Col>
            <CoinBalanceCol>
              <button type="button" onClick={() => setShowDialog(true)}>
                <UnderlinedText color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="ClubShop.Header.Help"
                    defaultMessage="How to earn Coins?"
                  />
                </UnderlinedText>
              </button>
              <ClubShopButton to={FOOTBALL_CLUB_SHOP}>
                <CoinAmount amount={currentUser?.coinBalance || 0} />
              </ClubShopButton>
            </CoinBalanceCol>
          </FlexContainer>
        </MainContainer>
      </Root>
      <OnboardingDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default Header;
