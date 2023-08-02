import { Operation } from '@apollo/client/core';
import { createContext, useContext } from 'react';

export interface GraphQLCall {
  id: string;
  operation: Operation;
  complexity: number;
  depth: number;
  subgraphs: string[];
}

export interface DebugContext {
  recordGQLOperation: (call: GraphQLCall) => void;
}

export const debugContext = createContext<DebugContext | null>(null);

export const useDebugContext = () => useContext(debugContext)!;

export default debugContext.Provider;
