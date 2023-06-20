import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import Dots from '@sorare/core/src/atoms/layout/Dots';
import { glossary } from '@sorare/core/src/lib/glossary';

import { CommonCards } from '@sorare/football/src/components/onboarding/DiscoverScarcities/CommonCards';
import { DiscoverScarcitiesTitle } from '@sorare/football/src/components/onboarding/DiscoverScarcities/DiscoverScarcitiesTitle';
import { ScarceCards } from '@sorare/football/src/components/onboarding/DiscoverScarcities/ScarceCards';

const scarceBackground = css`
  background: linear-gradient(
      90deg,
      rgba(128, 148, 255, 0.2) 0%,
      rgba(217, 199, 255, 0.2) 28.32%,
      rgba(228, 184, 255, 0.2) 54.55%,
      rgba(45, 66, 178, 0.2) 100%
    ),
    var(--c-static-neutral-800);
`;

const ScrollWrapper = styled.div`
  --scarcities-footer-height: 48px;
  color: var(--c-neutral-1000);
  height: var(--100vh);
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: var(--quadruple-unit);
`;

const CommonWrapper = styled(ScrollWrapper)`
  background-color: var(--c-neutral-200);
`;

const ScarceWrapper = styled(ScrollWrapper)`
  ${scarceBackground}
`;

const Footer = styled(Container)`
  position: sticky;
  bottom: 0;
  min-height: var(--scarcities-footer-height);
`;

const CommonFooter = styled(Footer)`
  background-color: var(--c-neutral-200);
`;

const ScarceFooter = styled(Footer)`
  ${scarceBackground}
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'back dots next';
  align-items: center;
`;

const DotsWrapper = styled.div`
  grid-area: dots;
`;

const NextButton = styled(Button)`
  grid-area: next;
  justify-self: end;
`;

const BackButton = styled(Button)`
  grid-area: back;
  justify-self: start;
`;

type Props = {
  commonCardPictureUrl: string;
  onFinishOnboarding: () => void;
};

export const MobileDiscoverScarcities = ({
  commonCardPictureUrl,
  onFinishOnboarding,
}: Props) => {
  const [showCommon, setShowCommon] = useState(true);
  const onDotsClick = (index: number) => {
    setShowCommon(index === 0);
  };

  return showCommon ? (
    <CommonWrapper>
      <Container>
        <DiscoverScarcitiesTitle />
        <CommonCards cardPictureUrl={commonCardPictureUrl} />
      </Container>
      <CommonFooter>
        <FooterContent>
          <DotsWrapper>
            <Dots
              count={2}
              current={showCommon ? 0 : 1}
              onChange={onDotsClick}
            />
          </DotsWrapper>
          <NextButton small color="blue" onClick={() => setShowCommon(false)}>
            <FormattedMessage {...glossary.next} />
          </NextButton>
        </FooterContent>
      </CommonFooter>
    </CommonWrapper>
  ) : (
    <ScarceWrapper>
      <Container>
        <DiscoverScarcitiesTitle />
        <ScarceCards />
      </Container>
      <ScarceFooter>
        <FooterContent>
          <BackButton small color="white" onClick={() => setShowCommon(true)}>
            <FormattedMessage {...glossary.back} />
          </BackButton>
          <DotsWrapper>
            <Dots
              count={2}
              current={showCommon ? 0 : 1}
              onChange={onDotsClick}
            />
          </DotsWrapper>
          <NextButton small color="blue" onClick={onFinishOnboarding}>
            <FormattedMessage {...glossary.continue} />
          </NextButton>
        </FooterContent>
      </ScarceFooter>
    </ScarceWrapper>
  );
};
