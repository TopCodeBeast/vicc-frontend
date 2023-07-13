import { ReactElement } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';

const Root = styled.div`
  margin-top: auto;
  padding: var(--double-unit);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--unit);
  width: 100%;
  align-items: center;
  view-transition-name: onboarding-dialog-footer;
  & > :first-child {
    justify-self: start;
  }
  & > :last-child {
    justify-self: end;
  }
`;

type Props = {
  left: ReactElement | null;
  middle: ReactElement | null;
  right: ReactElement | null;
};
const Footer = ({ left, middle, right }: Props) => (
  <Root>
    <div>{left}</div>
    <div>{middle}</div>
    <div>{right}</div>
  </Root>
);

export default Footer;
