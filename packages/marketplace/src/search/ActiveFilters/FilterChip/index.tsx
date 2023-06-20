import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';

type Props = {
  label: ReactNode;
  onClick?: () => void;
  onClose?: () => void;
  transparent?: boolean;
};

const StyledText14 = styled(Text16)`
  padding-left: var(--half-unit);
`;

export const FilterChip = ({ label, onClick, onClose, transparent }: Props) => {
  const baseCustom = {
    color: 'var(--c-neutral-1000)',
    background: 'var(--c-neutral-400)',
  };

  return (
    <Chip
      size="small"
      custom={{
        ...baseCustom,
        ...(transparent
          ? {
              background: 'transparent',
            }
          : {}),
      }}
      label={Label => (
        <Label as={onClick ? 'button' : undefined} onClick={onClick}>
          <StyledText14 bold>{label}</StyledText14>
        </Label>
      )}
      action={Action =>
        !!onClose && (
          <Action transparent as="button" icon={faTimes} onClick={onClose} />
        )
      }
    />
  );
};
