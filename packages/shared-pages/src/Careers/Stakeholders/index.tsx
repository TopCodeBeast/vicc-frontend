/* eslint-disable react/no-unescaped-entities */
import styled from 'styled-components';

import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import stakeholders from '../assets/stakeholders.png';
import {
  ImageSection,
  Img,
  StyledContainer,
  Text,
  Title,
  TwoColumnsContainer,
} from '../ui';

const StakeholdersSection = styled(ImageSection)`
  @media ${laptopAndAbove} {
    background-image: url(${stakeholders});
  }
`;

export const Stakeholders = () => {
  const { up: isLaptop } = useScreenSize('laptop');

  return (
    <>
      {!isLaptop && <Img src={stakeholders} alt="Vicc stakeholders" />}
      <StakeholdersSection vAlignContent="center" blackLayer="left">
        <StyledContainer>
          <TwoColumnsContainer image="right">
            <div>
              <Title white>Vicc stakeholders</Title>
              <Text white>
                Vicc is funded by a world-class team including SoftBank,
                Benchmark, Accel Partners, and Headline; star footballers Gerard
                Piqué, Antoine Griezmann, and Rio Ferdinand; and key tech
                investors such as Alexis Ohanian, among many others. In
                addition, the company has promotional and/or brand ambassador
                partnerships with sports icons Lionel Messi, Zinedine Zidane,
                and Serena Williams.
              </Text>
            </div>
            {isLaptop && <div />}
          </TwoColumnsContainer>
        </StyledContainer>
      </StakeholdersSection>
    </>
  );
};
