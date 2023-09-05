/* eslint-disable react/no-unescaped-entities */
import styled from 'styled-components';

import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import history from '../assets/history.png';
import {
  ImageSection,
  Img,
  StyledContainer,
  Text,
  Title,
  TwoColumnsContainer,
} from '../ui';

const HistorySection = styled(ImageSection)`
  @media ${laptopAndAbove} {
    background-image: url(${history});
  }
`;

export const History = () => {
  const { up: isLaptop } = useScreenSize('laptop');

  return (
    <>
      {!isLaptop && <Img src={history} alt="Vicc's history" />}
      <HistorySection vAlignContent="center">
        <StyledContainer>
          <TwoColumnsContainer image="left">
            {isLaptop && <div />}
            <div>
              <Title white>Vicc's history</Title>
              <Text white>
                Founded in 2018, Vicc was created by football fans for
                football fans – and in short order has partnered with the
                globe's biggest football clubs (300-plus) while amassing more
                than 3 million Managers across nearly every country in the
                world. In 2022, Vicc expanded into baseball and basketball via
                exclusive partnerships with MLB and the NBA, respectively.
                Here's the Vicc{' '}
                <a
                  href="https://medium.com/vicc/the-annual-sorare-2022-year-in-review-e436090b9ee1"
                  target="_blank"
                  rel="noreferrer"
                >
                  2022 year in review
                </a>
                , which also includes plans and priorities for 2023.
              </Text>
            </div>
          </TwoColumnsContainer>
        </StyledContainer>
      </HistorySection>
    </>
  );
};
