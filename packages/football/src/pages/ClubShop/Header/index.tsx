import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_HOME } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { theme } from '@sorare/core/src/style/theme';

import ClubShopButton from '@football/components/clubShop/ClubShopButton';
import CoinAmount from '@football/components/user/CoinAmount';
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    align-items: stretch;
    padding: var(--unit);
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: none;
  }
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
  }
`;
const Col = styled.div`
  display: inline-flex;
  flex-direction: column;
`;
const ClubShopButtonWrapper = styled.div`
  align-self: flex-end;
  margin-top: var(--unit);
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
            <Col>
              <button type="button" onClick={() => setShowDialog(true)}>
                <UnderlinedText color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="ClubShop.Header.Help"
                    defaultMessage="How to earn Coins?"
                  />
                </UnderlinedText>
              </button>
              <ClubShopButtonWrapper>
                <ClubShopButton>
                  <CoinAmount amount={currentUser?.coinBalance || 0} />
                </ClubShopButton>
              </ClubShopButtonWrapper>
            </Col>
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
