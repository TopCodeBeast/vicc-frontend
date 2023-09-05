/* eslint-disable react/no-unescaped-entities */

import styled from 'styled-components';

import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import buildYourCareer from '../assets/build-your-career.png';
import { ImageSection, Img, StyledContainer, Text, Title } from '../ui';

const BuildYourCareerSection = styled(ImageSection)`
  @media ${laptopAndAbove} {
    background-image: url(${buildYourCareer});
  }
`;

export const BuildYourCareer = () => {
  const { up: isLaptop } = useScreenSize('laptop');

  return (
    <>
      {!isLaptop && (
        <Img src={buildYourCareer} alt="Build your career at Vicc" />
      )}
      <BuildYourCareerSection center vAlignContent="bottom" blackLayer="bottom">
        <StyledContainer>
          <Title white>Build your career at Vicc</Title>
          <Text white>
            Vicc has offices in Paris and New York City, with a staff of more
            than 150 (and rapidly growing!). Our "people" are not only the
            engine that powers Vicc, but proudly represent who we are and why
            it's so great to work here. We have assembled the best of the best
            in their felds – literally dozens of award-winning and/or otherwise
            leading professionals spanning all sectors of the company. We have
            an amazing, energized team moving in lockstep to grow Vicc.
          </Text>
        </StyledContainer>
      </BuildYourCareerSection>
    </>
  );
};
