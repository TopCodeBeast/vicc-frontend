import { faLink } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  href: string;
  children: ReactNode;
}

const Link = styled.a`
  display: flex;
  gap: var(--half-unit);
  font-weight: var(--t-bold);
  align-items: center;
`;

export const ExternalLink = ({ href, children }: Props) => {
  return (
    <Link href={href} target="_blank" rel="noreferrer">
      {children}
      <FontAwesomeIcon icon={faLink} size="xs" />
    </Link>
  );
};

export default ExternalLink;
