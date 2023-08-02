import { FormControlLabel } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@core/atoms/buttons/ButtonBase';
import { glossary } from '@core/lib/glossary';

const RowRoot = styled.div`
  width: 100%;
  gap: var(--double-unit);
  display: flex;
  justify-content: space-between;
`;

const Cta = styled(ButtonBase)`
  position: absolute;
  top: var(--unit);
  right: 0;
  color: var(--c-neutral-1000);
  text-decoration: underline;
  margin-top: var(--unit);
`;
const StyledFormControlLabel = styled(FormControlLabel)`
  display: flex;
  flex-direction: column-reverse;
  gap: var(--unit);
  align-items: flex-start;
  margin: 0;
  padding: var(--unit) 0;
  position: relative;

  &:not(:first-child) {
    border-top: 1px solid var(--c-neutral-400);
  }

  label {
    color: var(--c-neutral-1000);
  }
`;
type Props = {
  value: ReactNode;
  label: ReactNode;
  children?: ReactNode;
  readonly?: boolean;
};

export const EditableRow = ({
  readonly = false,
  label,
  value,
  children,
}: Props) => {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <StyledFormControlLabel
      label={label}
      control={
        <RowRoot>
          {isEditable ? children : value}
          {!readonly && (
            <Cta onClick={() => setIsEditable(!isEditable)}>
              {isEditable ? (
                <FormattedMessage {...glossary.done} />
              ) : (
                <FormattedMessage {...glossary.edit} />
              )}
            </Cta>
          )}
        </RowRoot>
      }
    />
  );
};
