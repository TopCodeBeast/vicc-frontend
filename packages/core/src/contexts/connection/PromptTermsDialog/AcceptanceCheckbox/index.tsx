import { ComponentProps, ReactNode } from 'react';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';

interface Props extends Pick<ComponentProps<typeof Checkbox>, 'style'> {
  name: string;
  label: ReactNode;
  value: boolean;
  onChange: () => void;
}

export const AcceptanceCheckbox = ({
  name,
  label,
  value,
  onChange,
  ...rest
}: Props) => {
  return (
    <Checkbox
      {...rest}
      name={name}
      value={value}
      checked={value}
      onChange={onChange}
      label={label}
    />
  );
};

export default AcceptanceCheckbox;
