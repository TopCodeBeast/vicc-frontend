import styled from 'styled-components';

const Root = styled.div`
  position: relative;
  width: 230px;
  height: 100%;
  margin: auto;
`;

const Img = styled.img`
  position: absolute;
`;
type Props = {
  firstPlayerCard: string;
  secondPlayerCard: string;
};
export const Onboarding2 = ({ firstPlayerCard, secondPlayerCard }: Props) => (
  <Root>
    <Img
      src={secondPlayerCard}
      alt=""
      style={{ width: 120, top: 90, left: 110, transform: 'rotate(7deg)' }}
    />
    <Img
      src={firstPlayerCard}
      alt=""
      style={{ width: 120, top: 70, left: 0, transform: 'rotate(-5deg)' }}
    />
  </Root>
);
