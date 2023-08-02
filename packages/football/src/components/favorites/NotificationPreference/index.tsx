import { TypedDocumentNode, gql } from '@apollo/client';
import {
  faBell,
  faBellOn,
  faBellSlash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuItem } from '@material-ui/core';
import classnames from 'classnames';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import { Text16 } from '@sorare/core/src/atoms/typography';
import ScarcityBall from '@sorare/core/src/components/card/ScarcityBall';
import { Dialog } from '@sorare/core/src/components/dialog';
import { useFollowContext } from '@sorare/core/src/contexts/follow';
import useUpdateSubscription from '@sorare/core/src/hooks/subscriptions/useUpdateSubscription';
import {
  BlockchainScarcity,
  subscribableRarities,
} from '@sorare/core/src/lib/cards';

import { NotificationPreference_subscription } from './__generated__/index.graphql';

const bell = (notifyForRarities: string[]) => {
  if (notifyForRarities.length === 0) {
    return faBellSlash;
  }
  if (subscribableRarities.every(r => notifyForRarities.includes(r))) {
    return faBellOn;
  }
  return faBell;
};

const messages = defineMessages({
  dialogTitle: {
    id: 'NotificationPreference.dialogTitle',
    defaultMessage: 'Scarcities you want to be notified for',
  },
});

const CustomRoot = styled.div`
  display: flex;
  justify-content: space-between;
`;

type CustomScarcityPreferenceProps = {
  scarcity: BlockchainScarcity;
  enabled: boolean;
  toggle: () => void;
};
const CustomScarcityPreference = ({
  scarcity,
  enabled,
  toggle,
}: CustomScarcityPreferenceProps) => {
  return (
    <CustomRoot>
      <ScarcityBall scarcity={scarcity} />
      <Checkbox checked={enabled} onChange={toggle} />
    </CustomRoot>
  );
};

const CenteredText16 = styled(Text16)`
  text-align: center;
`;
const Body = styled.div`
  padding: var(--triple-unit);
`;
const DialogContent = styled.div`
  margin-top: 10px;
  & > * + * {
    margin-top: 10px;
    border-top: 1px solid var(--c-neutral-300);
    padding-top: 10px;
  }
`;
const Row = styled(MenuItem)`
  display: flex;
  color: var(--c-static-neutral-800);
  & > * + * {
    margin-left: 10px;
  }
  &.current {
    color: var(--c-brand-600);
  }
`;

type Props = {
  subscription: NotificationPreference_subscription;
};
export const NotificationPreference = ({ subscription }: Props) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { updateMySubscriptions } = useFollowContext();

  const openMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setMenuAnchor(event.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
  };
  const [customOpened, setCustomOpened] = useState(false);
  const updateSubscription = useUpdateSubscription(subscription);

  const { notifyForRarities } = subscription.preferences;

  const updateSubscriptionRarities = async (
    scarcities: BlockchainScarcity[],
    updatedValue: boolean
  ) => {
    const res = await updateSubscription(scarcities, updatedValue);
    const updatedSubscription = res.data?.updateSubscription?.subscription;
    if (updatedSubscription) updateMySubscriptions(updatedSubscription);
  };
  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={customOpened}
        onClose={() => {
          setCustomOpened(false);
          closeMenu();
        }}
        title={
          <CenteredText16 bold>
            <FormattedMessage {...messages.dialogTitle} />
          </CenteredText16>
        }
        body={
          <Body>
            <Text16>
              <FormattedMessage
                id="NotificationPreference.help"
                defaultMessage="Each time a new Card is listed you’ll receive a notification"
              />
            </Text16>
            <DialogContent>
              {subscribableRarities.map(scarcity => {
                const enabled = notifyForRarities.includes(scarcity);
                return (
                  <CustomScarcityPreference
                    key={scarcity}
                    scarcity={scarcity}
                    enabled={enabled}
                    toggle={() => {
                      updateSubscriptionRarities([scarcity], !enabled);
                    }}
                  />
                );
              })}
            </DialogContent>
          </Body>
        }
      />
      <IconButton
        icon={bell(notifyForRarities)}
        onClick={openMenu}
        color="black"
      />
      <Menu
        id="simple-menu"
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <Row
          className={classnames({
            current: subscribableRarities.every(r =>
              notifyForRarities.includes(r)
            ),
          })}
          onClick={() => {
            updateSubscriptionRarities(subscribableRarities, true).then(
              closeMenu
            );
          }}
        >
          <FontAwesomeIcon icon={faBellOn} />
          <Text16>
            <FormattedMessage
              id="NotificationPreference.all"
              defaultMessage="All scarcities"
            />
          </Text16>
        </Row>
        <Row
          className={classnames({
            current:
              notifyForRarities.length > 0 &&
              notifyForRarities.length < subscribableRarities.length,
          })}
          onClick={() => setCustomOpened(true)}
        >
          <FontAwesomeIcon icon={faBell} />
          <Text16>
            <FormattedMessage
              id="NotificationPreference.custom"
              defaultMessage="Custom"
            />
          </Text16>
        </Row>
        <Row
          className={classnames({
            current: notifyForRarities.length === 0,
          })}
          onClick={() => {
            updateSubscriptionRarities(subscribableRarities, false).then(
              closeMenu
            );
          }}
        >
          <FontAwesomeIcon icon={faBellSlash} />
          <Text16>
            <FormattedMessage
              id="NotificationPreference.none"
              defaultMessage="None"
            />
          </Text16>
        </Row>
      </Menu>
    </>
  );
};

NotificationPreference.fragments = {
  subscription: gql`
    fragment NotificationPreference_subscription on EmailSubscription {
      slug
      preferences {
        slug
        notifyForRarities
      }
    }
  ` as TypedDocumentNode<NotificationPreference_subscription>,
};

export default NotificationPreference;
