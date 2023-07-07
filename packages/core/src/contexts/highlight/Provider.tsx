import { ReactNode, useState } from 'react';

import HighlightContextProvider, { Options } from '.';

interface Highlighted {
  previous: string | null;
  current: string | null;
  options: Options;
}

interface Props {
  children: ReactNode;
}

export const HighlightProvider = ({ children }: Props) => {
  const [highlighted, setHighlighted] = useState<Highlighted>({
    previous: null,
    current: null,
    options: {},
  });
  const { current } = highlighted;
  const { callback } = highlighted.options;

  const highlight = (name: string, options?: Options) => {
    if (name === current) return;

    setHighlighted(prev => ({
      previous: prev.current,
      current: name,
      options: options || {},
    }));
  };

  const unhighlight = () => {
    if (current === null) return;

    if (callback) callback();
    setHighlighted(prev => ({
      previous: prev.current,
      current: null,
      options: {},
    }));
  };

  return (
    <HighlightContextProvider
      value={{
        highlighted: highlighted.current,
        prevHighlighted: highlighted.previous,
        highlight,
        unhighlight,
      }}
    >
      {children}
    </HighlightContextProvider>
  );
};

export default HighlightProvider;
