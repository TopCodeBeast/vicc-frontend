import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button as MuiButton } from '@material-ui/core';
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type Props = {
  to?: string;
  onClick?: () => void;
  children?: ReactNode;
  size?: 'small' | 'medium';
};

const buttonProps = (
  to: string | undefined,
  onClick: (() => void) | undefined
) => (to ? { to, component: Link } : { onClick });

const Button = styled(MuiButton)`
  color: var(--c-neutral-600);
  background: none;
  border: none;
  &:hover {
    color: rgba(var(--c-rgb-neutral-600), 0.8);
    background: none;
  }
`;

export const BackLink = (props: Props) => {
  const { children, to, onClick, size = 'small' } = props;
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Button
      {...buttonProps(to, onClick || goBack)}
      size={size}
      startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
    >
      {children}
    </Button>
  );
};

export default BackLink;
