import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ViccLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import StarBall from '@sorare/core/src/atoms/icons/StarBall';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import { LANDING } from '@sorare/core/src/constants/routes';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  background-color: var(--c-brand-800);
  color: var(--c-neutral-100);
  padding: var(--double-unit);
`;
const SmallStarBall = styled(StarBall)`
  width: 16px;
`;
const FlexContainer = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;
const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
`;
const WhiteLink = styled(Link)`
  &,
  &:focus,
  &:hover {
    color: var(--c-neutral-100);
  }
`;

type Props = { displayTitle?: boolean };
const Header = ({ displayTitle }: Props) => {
  return (
    <Root>
      <Navbar>
        <FlexContainer>
          <SmallStarBall />
          <ViccLogo />
        </FlexContainer>

        <FlexContainer>
          <WhiteLink to={LANDING}>sorare.com</WhiteLink>
        </FlexContainer>
      </Navbar>

      <Text14 color="var(--c-neutral-500)">
        sorare.com / submit a request
      </Text14>

      {displayTitle && (
        <Title2>
          <FormattedMessage
            id="NoCardEntryForm.title"
            defaultMessage="Submit a request"
          />
        </Title2>
      )}
    </Root>
  );
};

export default Header;
