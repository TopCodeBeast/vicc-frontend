import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import FollowButton from '@sorare/core/src/components/favorites/FollowButton';
import SubscribersCount from '@sorare/core/src/components/favorites/SubscribersCount';
import { useFollowContext } from '@sorare/core/src/contexts/follow';
import { isA } from '@sorare/core/src/lib/gql';

import NotificationPreference from '@sorare/football/src/components/favorites/NotificationPreference';
import { usePageContext } '@sorare/football/src/contexts/page';

import PrivacyPolicyDialog from './PrivacyPolicyDialog';
import { Follower_dataPartner } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  justify-content: inherit;
`;

type Props = {
  dataPartner?: Follower_dataPartner | null;
};

export const Follower = ({ dataPartner }: Props) => {
  const { object } = usePageContext();
  const [showPrivacyPolicyDialog, setShowPrivacyPolicyDialog] =
    useState<boolean>(false);
  const { getCurrentUserSubscription } = useFollowContext();
  const currentUserSubscription = getCurrentUserSubscription(object);

  const onChange = (value: boolean) => {
    if (dataPartner && value) setShowPrivacyPolicyDialog(true);
  };

  return (
    <Root>
      {isA('Player', object) && currentUserSubscription && (
        <NotificationPreference subscription={currentUserSubscription} />
      )}
      <FollowButton subscribable={object} onChange={onChange} />
      <SubscribersCount subscribable={object} />
      {dataPartner && showPrivacyPolicyDialog && (
        <PrivacyPolicyDialog
          dataPartner={dataPartner}
          onClose={() => setShowPrivacyPolicyDialog(false)}
        />
      )}
    </Root>
  );
};

Follower.fragments = {
  dataPartner: gql`
    fragment Follower_dataPartner on DataPartner {
      slug
      ...PrivacyPolicyDialog_dataPartner
    }
    ${PrivacyPolicyDialog.fragments.dataPartner}
  `,
};

export default Follower;
