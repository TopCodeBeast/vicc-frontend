import { ReactNode } from 'react';
import styled from 'styled-components';

import { isExternalDomain, toRelative } from '@sorare/core/src/lib/urls';
import { Link } from 'routing/Link';

const Root = styled.a`
  text-decoration: none;
  color: inherit;
  &:hover,
  &:focus {
    color: inherit;
  }
`;

const ContentLink = ({
  url,
  children,
  onClick,
}: {
  url: string;
  children: ReactNode;
  onClick?: () => void;
}) => {
  const isExternal = isExternalDomain(url);

  if (isExternal) {
    return (
      <Root
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </Root>
    );
  }

  return (
    <Root to={toRelative(url)} onClick={onClick} as={Link}>
      {children}
    </Root>
  );
};

export default ContentLink;
