import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { text16, text20 } from '@sorare/core/src/atoms/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const Wrapper = styled(LinkBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--quadruple-unit) var(--unit);
  @media ${tabletAndAbove} {
    padding: var(--quadruple-unit);
  }
  border-radius: var(--unit);
  border: 1px solid var(--c-neutral-300);
  gap: var(--unit);
  max-height: 200px;
`;

const nameStyle = css`
  flex: 1;
  ${text16}
  @media ${tabletAndAbove} {
    ${text20}
  }
  color: var(--c-neutral-1000);
  text-align: center;
`;

const TextName = styled.div`
  ${nameStyle}
`;

const LinkName = styled(LinkOverlay)`
  ${nameStyle}
  &,
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
  }
`;

const Logo = styled.div`
  & > img {
    min-height: 50px;
    height: 50px;
  }
  @media ${tabletAndAbove} {
    & > img {
      min-height: 80px;
      height: 80px;
    }
  }
`;

type Props = {
  logoUrl: string;
  to?: string;
  name: string;
};

export const Item = ({ logoUrl, to, name }: Props) => {
  return (
    <Wrapper>
      <Logo>
        <img src={logoUrl || ''} alt="" height={50} />
      </Logo>
      {to ? (
        <LinkName as={Link} to={to}>
          {name}
        </LinkName>
      ) : (
        <TextName>{name}</TextName>
      )}
    </Wrapper>
  );
};
