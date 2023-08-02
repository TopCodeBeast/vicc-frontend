import { ReactNode } from 'react';
import styled from 'styled-components';

import LoadMoreButton, {
  Props as LoadMoreProps,
} from '@sorare/core/src/atoms/buttons/LoadMoreButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';

import ResultCount from '../ResultCount';

interface Props {
  displayLoading?: boolean;
  count?: number;
  items?: Array<ReactNode | null> | null;
  loadMoreSection?: LoadMoreProps;
}

const Contents = styled.div`
  gap: var(--double-unit);
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const LoadMore = styled.div`
  display: flex;
  justify-content: center;
`;

const DisplayItems = ({
  displayLoading,
  count,
  items,
  loadMoreSection,
}: Props) => {
  return (
    <>
      {displayLoading ? <LoadingIndicator /> : null}
      {count !== undefined ? <ResultCount count={count} /> : null}
      <Contents>
        {items}
        {loadMoreSection && (
          <LoadMore>
            <LoadMoreButton {...loadMoreSection} />
          </LoadMore>
        )}
      </Contents>
    </>
  );
};

export default DisplayItems;
