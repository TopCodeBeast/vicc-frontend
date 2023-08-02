import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Portal } from '@core/atoms/layout/Portal';
import { Title3 } from '@core/atoms/typography';
import { hasPreviousLocation } from '@core/lib/routing';
import { Link } from '@core/routing/Link';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const Title = styled(Title3)`
  &:hover,
  &:focus,
  &:active {
    color: initial;
  }
`;
type Props = {
  title: ReactNode;
  defaultBackTo: string;
};

export const PageHeader = ({ title, defaultBackTo }: Props) => {
  const navigate = useNavigate();
  return (
    <Portal id="page-header-title">
      <Wrapper>
        <IconButton
          icon={faChevronLeft}
          color="transparent"
          onClick={() => {
            if (hasPreviousLocation(-1)) {
              navigate(-1);
            } else {
              navigate(defaultBackTo!);
            }
          }}
        />
        <Title
          as={Link}
          to="."
          onClick={e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {title}
        </Title>
      </Wrapper>
    </Portal>
  );
};
