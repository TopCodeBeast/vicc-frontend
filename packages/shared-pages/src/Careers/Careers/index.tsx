import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title1 } from '@sorare/core/src/atoms/typography';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import careers from '../assets/careers.png';
import values from '../assets/values.svg';
import { ImageSection, ResetFontSizeContainer, StyledContainer } from '../ui';

const CareersTitle = styled(Title1)`
  font-size: 52px;
  line-height: 1;
  color: var(--c-neutral-100);
  margin-bottom: var(--double-unit);
  @media ${laptopAndAbove} {
    font-size: 128px;
  }
`;
const ViewJobOpeningsButtonLabel = styled(Text16)`
  font-style: italic;
`;

const CareersSection = styled(ImageSection)`
  aspect-ratio: 18/6;
  background-image: url(${careers});
`;
const ValuesBand = styled.div`
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 5px;

  background-image: url(${values});
  background-repeat: repeat-x;
`;

export const Careers = () => {
  return (
    <ResetFontSizeContainer>
      <CareersSection
        vAlignContent="bottom"
        blackLayer="bottom"
        keepImageOnMobile
      >
        <StyledContainer>
          <div>
            <CareersTitle>Careers</CareersTitle>
            <Button color="white" medium component={Link} to="#jobs">
              <ViewJobOpeningsButtonLabel uppercase>
                View job openings
              </ViewJobOpeningsButtonLabel>
            </Button>
          </div>
        </StyledContainer>
        <ValuesBand />
      </CareersSection>
    </ResetFontSizeContainer>
  );
};
