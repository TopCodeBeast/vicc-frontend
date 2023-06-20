import { FormattedMessage } from 'react-intl';

import LoadingButton, {
  Props as LoadingButtonProps,
} from '@sorare/core/src/atoms/buttons/LoadingButton';
import { glossary } from '@sorare/core/src/lib/glossary';

export interface Props extends LoadingButtonProps {
  hasMore?: boolean;
  loading: boolean;
  loadMore: () => void;
}

const LoadMoreButton = ({ hasMore, loading, loadMore, ...rest }: Props) => {
  if (!hasMore) return null;

  return (
    <LoadingButton
      loading={loading}
      color="white"
      medium
      disabled={loading}
      onClick={loadMore}
      {...rest}
    >
      <FormattedMessage {...glossary.loadMore} />
    </LoadingButton>
  );
};

export default LoadMoreButton;
