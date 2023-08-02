import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';

import crown from './assets/crown.png';
import magic from './assets/magic.png';
import trophy from './assets/trophy.png';

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--unit);
  border-radius: var(--double-unit);
  width: 277px;
  height: 192px;
  background: linear-gradient(
    -135deg,
    rgba(231, 180, 255, 0.25) 0%,
    rgba(172, 66, 222, 0.25) 100%
  );

  &:hover {
    .trophy {
      transform: translate3d(10px, 15px, 0);
    }
    .magic {
      transform: translate3d(-10px, 15px, 0);
    }
    .crown {
      transform: translate3d(-25px, -10px, 0);
    }
  }
`;
const FlexColContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RoundedGradientBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  width: 40px;
  border-radius: 100%;
  background: linear-gradient(
    -135deg,
    rgba(231, 180, 255, 1) 0%,
    rgba(172, 66, 222, 1) 100%
  );
`;
const AnimatedImage = styled.img`
  transition: 0.3s ease-out transform;
`;
const Trophy = styled(AnimatedImage)`
  position: absolute;
  z-index: 0;
  aspect-ratio: 1;
  width: 120px;
  bottom: 10px;
  right: -20px;
`;
const Magic = styled(AnimatedImage)`
  position: absolute;
  z-index: 0;
  aspect-ratio: 1;
  width: 96px;
  bottom: 0px;
  left: -20px;
`;
const Crown = styled(AnimatedImage)`
  position: absolute;
  z-index: 0;
  aspect-ratio: 1;
  width: 82px;
  top: 5px;
  left: 20px;
`;

export const EmptyStateCta = () => {
  return (
    <Root>
      <RoundedGradientBackground>
        <FontAwesomeIcon icon={faPlus} size="sm" />
      </RoundedGradientBackground>
      <FlexColContainer>
        <Text16 color="var(--c-neutral-1000)" bold>
          <FormattedMessage
            id="EmptyStateCta.title"
            defaultMessage="Create or join competition"
          />
        </Text16>
        <Text14 color="var(--c-neutral-500)">
          <FormattedMessage
            id="EmptyStateCta.subtitle"
            defaultMessage="Play with your friends"
          />
        </Text14>
      </FlexColContainer>
      <Trophy className="trophy" src={trophy} />
      <Magic className="magic" src={magic} />
      <Crown className="crown" src={crown} />
    </Root>
  );
};

export default EmptyStateCta;
