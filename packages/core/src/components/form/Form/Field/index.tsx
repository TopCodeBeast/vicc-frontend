import { FunctionComponent, useEffect, useState } from 'react';

import { useFormContext } from '../context';

interface RenderProps {
  name: string;
  error: string | null;
  handleChange: (name: string) => (event: {
    target: {
      value: string;
    };
  }) => void;
  value: string;
}

interface Props {
  defaultValue?: any;
  name: string;
  render: FunctionComponent<React.PropsWithChildren<RenderProps>>;
}

export const Field = ({ defaultValue, name, render }: Props) => {
  const { registerField, handleChange } = useFormContext();

  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      registerField(name, {
        onChange: (val: string) => setValue(val),
        onError: (err: string | null) => setError(err),
        defaultValue,
      }),
    [defaultValue, name, registerField]
  );

  return render({ name, error, handleChange, value });
};

export default Field;
