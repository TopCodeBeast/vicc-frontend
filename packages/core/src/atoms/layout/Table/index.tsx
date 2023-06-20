import MUITable, { TableProps } from '@material-ui/core/Table';
import styled from 'styled-components';

const Root = styled(MUITable)`
  border-collapse: separate;
  & > tbody {
    & > tr {
      & > * {
        border-bottom: 1px solid var(--c-neutral-300);
      }
      & > :first-child {
        border-left: 1px solid var(--c-neutral-300);
      }
      & > :last-child {
        border-right: 1px solid var(--c-neutral-300);
      }
      &:first-child {
        & > * {
          border-top: 1px solid var(--c-neutral-300);
        }
        & > *:first-child {
          border-top-left-radius: 8px;
        }
        & > *:last-child {
          border-top-right-radius: 8px;
        }
      }
      &:last-child {
        & > *:first-child {
          border-bottom-left-radius: 8px;
        }
        & > *:last-child {
          border-bottom-right-radius: 8px;
        }
      }
    }
  }
`;

export const Table = (props: Omit<TableProps, 'classes'>) => {
  return <Root {...props} />;
};

export default Table;
