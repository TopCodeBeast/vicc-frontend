import styled from 'styled-components';

import BackButton from '../BackButton';
import CloseButton from '../CloseButton';

export const Container = styled.div`
  display: grid;
  grid-template-areas: 'left center right';
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  padding: var(--double-unit);
`;
export const Left = styled.div`
  grid-area: left;
`;
export const Center = styled.div`
  grid-area: center;
`;
export const Right = styled.div`
  grid-area: right;
`;

type Props = {
  onBack?: () => void;
  onClose?: () => void;
  title?: React.JSX.Element;
};
const Header = ({ onBack, title, onClose }: Props) => (
  <Container>
    <Left>{onBack && <BackButton onBack={onBack} />}</Left>
    <Center>{title}</Center>
    <Right>{onClose && <CloseButton onClose={onClose} />}</Right>
  </Container>
);

export default Header;
