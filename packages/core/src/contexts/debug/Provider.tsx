/* eslint-disable no-console */
import {
  faClose,
  faExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useKey } from 'react-use';
import styled, { css } from 'styled-components';

import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';

import DebugContextProvider, { GraphQLCall } from '.';

interface Props {
  children: ReactNode;
}

interface DebugProps {
  graphQLCalls: GraphQLCall[];
}

const MEDIUM_COMPLEXITY = 1000;
const MEDIUM_DEPTH = 3;
const HIGH_COMPLEXITY = 3000;
const HIGH_DEPTH = 7;
const HIGH_GQL_CALLS = 7;

const Root = styled.button`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9999;
  padding: 5px 10px;
  background: rgb(237, 238, 241);
  border-top: 1px solid rgb(142, 142, 142);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-size: 10px;
  &.closed {
    cursor: pointer;
    right: 20px;
    left: auto;
    border: 1px solid rgb(142, 142, 142);
  }
`;
const Badge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background: var(--c-neutral-600);
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  font-weight: bold;
`;
const Calls = styled.ol`
  margin: 0 var(--double-and-a-half-unit) 0 0;
  padding: 0;
  display: flex;
  overflow-x: auto;
  & li {
    margin: 0;
    margin-right: 8px;
    white-space: nowrap;
  }
`;
const CloseButton = styled.button`
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 8px;
`;

const Status = styled.span<{ $state: 'ok' | 'warn' | 'error' }>`
  color: #00a64a;
  ${({ $state }) =>
    $state === 'warn'
      ? css`
          font-weight: bold;
          color: #f09b1a;
        `
      : null}
  ${({ $state }) =>
    $state === 'error'
      ? css`
          font-weight: bold;
          color: #d71a0e;
        `
      : null};
`;

const depthClass = (depth: number) => {
  if (depth < MEDIUM_DEPTH) return 'ok';
  if (depth < HIGH_DEPTH) return 'warn';
  return 'error';
};

const complexityClass = (complexity: number) => {
  if (complexity < MEDIUM_COMPLEXITY) return 'ok';
  if (complexity < HIGH_COMPLEXITY) return 'warn';
  return 'error';
};

const DebugInfos = (props: DebugProps) => {
  const { graphQLCalls } = props;
  const [open, setOpen] = useLocalStorage<boolean>(
    'gql-debug',
    process.env.NODE_ENV === 'development'
  );

  useKey(
    (event: KeyboardEvent) => {
      return event.key === 'i' && (event.metaKey || event.ctrlKey);
    },
    () => {
      setOpen(!open);
    }
  );

  if (!open) {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    const isComplex =
      graphQLCalls.length > HIGH_GQL_CALLS ||
      graphQLCalls.filter(
        call =>
          call.complexity > HIGH_COMPLEXITY ||
          (call.complexity > MEDIUM_COMPLEXITY && call.depth >= HIGH_DEPTH)
      ).length > 0;

    return (
      <Root type="submit" className="closed" onClick={() => setOpen(true)}>
        GraphQL<Badge>{graphQLCalls.length}</Badge>
        {isComplex && <FontAwesomeIcon icon={faExclamationTriangle} />}
      </Root>
    );
  }

  return (
    <Root as="div">
      <Calls>
        {graphQLCalls.map((call, i) => {
          const { operation, complexity, depth } = call;
          return (
            <li key={call.id}>
              <Badge>{i + 1}</Badge>
              {operation.operationName}(C=
              <Status $state={complexityClass(complexity)}>{complexity}</Status>
              , D=<Status $state={depthClass(depth)}>{depth}</Status>)
            </li>
          );
        })}
      </Calls>
      <CloseButton type="submit" onClick={() => setOpen(false)}>
        <FontAwesomeIcon icon={faClose} />
      </CloseButton>
    </Root>
  );
};

const SILENCED_OPERATIONS = ['PingConfigQuery'];

const DebugProvider = ({ children }: Props) => {
  const location = useLocation();
  const [graphQLCalls, setGraphQLCalls] = useState<
    Record<string, GraphQLCall[]>
  >({});

  const recordGQLOperation = useCallback(
    (call: GraphQLCall) => {
      const { operation, complexity, depth } = call;

      if (SILENCED_OPERATIONS.includes(operation.operationName)) {
        return;
      }
      setGraphQLCalls(v => {
        const calls = v[window.location.pathname] || [];
        console.log(
          '🐞 GraphQL Query',
          calls.length + 1,
          'complexity',
          complexity,
          'depth',
          depth,
          operation
        );
        return {
          ...v,
          [window.location.pathname]: calls.concat([call]),
        };
      });
    },
    [setGraphQLCalls]
  );

  return (
    <DebugContextProvider
      value={{
        recordGQLOperation,
      }}
    >
      {children}
      {!!Object.keys(graphQLCalls).length && (
        <DebugInfos graphQLCalls={graphQLCalls[location.pathname] || []} />
      )}
    </DebugContextProvider>
  );
};

export default DebugProvider;
