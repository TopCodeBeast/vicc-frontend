import { ReactElement } from 'react';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';

type Props = {
  id: string;
  children: ReactElement | string;
  error?: boolean;
  required?: boolean;
};

const Label = styled(Title6)`
  color: var(--c-neutral-1000);
  .error {
    font-weight: normal;
    color: var(--c-red-600);
  }
`;

const FormLabel = ({ id, children, error, required = false }: Props) => {
  return (
    <Label as="label" htmlFor={id}>
      {children} {required && '*'}{' '}
      {error && <span className="error">{error || null}</span>}
    </Label>
  );
};

export default FormLabel;
