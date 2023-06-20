import { ReactNode, useState } from 'react';

import SearchCardsContextProvider from '.';

interface Props {
  children: ReactNode;
}

const SearchCardsProvider = ({ children }: Props) => {
  const [legend, setLegend] = useState<boolean>(false);
  
  return (
    <SearchCardsContextProvider
      value={{
        
        legend,
        setLegend,
      }}
    >
      {children}
    </SearchCardsContextProvider>
  );
};

export default SearchCardsProvider;
