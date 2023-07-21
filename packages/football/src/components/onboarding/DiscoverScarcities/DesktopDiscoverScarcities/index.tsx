import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import { glossary } from '@sorare/core/src/lib/glossary';

import { CommonCards } from '@football/components/onboarding/DiscoverScarcities/CommonCards';
import { DiscoverScarcitiesTitle } from '@football/components/onboarding/DiscoverScarcities/DiscoverScarcitiesTitle';
import { ScarceCards } from '@football/components/onboarding/DiscoverScarcities/ScarceCards';

const StyledContainer = styled(Container)`
  background-color: var(--c-neutral-100);
  height: var(--100vh);
  color: var(--c-neutral-1000);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  align-items: center;
  padding: calc(7 * var(--unit)) 0;
`;

const ScarcitiesWrapper = styled.div`
  display: flex;
  gap: var(--double-and-a-half-unit);
  justify-content: center;
`;

const CardsWrapper = styled.div`
  border-radius: var(--double-unit);
  width: 360px;
  padding: var(--double-unit);
`;

const CommonCardsWrapper = styled(CardsWrapper)`
  background-color: var(--c-neutral-200);
`;

const ScarceCardsWrapper = styled(CardsWrapper)`
  background: linear-gradient(
      90deg,
      rgba(128, 148, 255, 0.2) 0%,
      rgba(217, 199, 255, 0.2) 28.32%,
      rgba(228, 184, 255, 0.2) 54.55%,
      rgba(45, 66, 178, 0.2) 100%
    ),
    var(--c-static-neutral-800);
`;

type Props = { onFinishOnboarding: () => void; commonCardPictureUrl: string };

export const DesktopDiscoverScarcities = ({
  onFinishOnboarding,
  commonCardPictureUrl,
}: Props) => {
  return (
    <StyledContainer>
      <Wrapper>
        <DiscoverScarcitiesTitle />
        <ScarcitiesWrapper>
          <CommonCardsWrapper>
            <CommonCards cardPictureUrl={commonCardPictureUrl} />
          </CommonCardsWrapper>
          <ScarceCardsWrapper>
            <ScarceCards />
          </ScarceCardsWrapper>
        </ScarcitiesWrapper>
        <Button small color="blue" onClick={onFinishOnboarding}>
          <FormattedMessage {...glossary.continue} />
        </Button>
      </Wrapper>
    </StyledContainer>
  );
};
