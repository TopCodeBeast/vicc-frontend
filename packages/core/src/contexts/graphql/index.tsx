import { createContext, useContext } from 'react';

interface GraphqlContext {
  refreshWsCable: () => void;
}

export const graphqlContext = createContext<GraphqlContext | null>(null);

export const useGraphqlContext = () => useContext(graphqlContext)!;

export default graphqlContext.Provider;
