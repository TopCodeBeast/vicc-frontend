import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import { NoCardEntryRegisterDialog } from '@sorare/core/src/components/noCardEntry/NoCardEntryRegisterDialog';

import PoolDetail from '@football/components/so5/NoCardEntry/PoolDetail';

import {
  NoCardEntryRegisterDialogConfiQuery,
  NoCardEntryRegisterDialogConfiQueryVariables,
} from './__generated__/index.graphql';

type Props = Omit<
  React.ComponentProps<typeof NoCardEntryRegisterDialog>,
  'maxLineupsPerUser' | 'emailAddress' | 'poolDetail'
>;

const NO_CARD_ENTRY_REGISTER_DIALOG_QUERY = gql`
  query NoCardEntryRegisterDialogConfiQuery {
    config {
      id
      vicc5Config {
        id
        noCardRoute {
          id
          emailAddress
          maxLineupsPerUser
          ...PoolDetail_noCardRoute
        }
      }
    }
  }
  ${PoolDetail.fragments.noCardRoute}
` as TypedDocumentNode<
  NoCardEntryRegisterDialogConfiQuery,
  NoCardEntryRegisterDialogConfiQueryVariables
>;

const Vicc5NoCardEntryRegisterDialog = (props: Props) => {
  const [loadConfig, { data, loading }] = useLazyQuery(
    NO_CARD_ENTRY_REGISTER_DIALOG_QUERY,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    }
  );

  const { open } = props;
  const { maxLineupsPerUser, emailAddress } =
    data?.config?.vicc5Config?.noCardRoute || {};

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open, loadConfig]);
  return (
    <NoCardEntryRegisterDialog
      {...props}
      loading={loading}
      maxLineupsPerUser={maxLineupsPerUser}
      emailAddress={emailAddress}
      poolDetail={<PoolDetail noCardRoute={data?.config?.vicc5Config?.noCardRoute} />}
    />
  );
};

export default Vicc5NoCardEntryRegisterDialog;
