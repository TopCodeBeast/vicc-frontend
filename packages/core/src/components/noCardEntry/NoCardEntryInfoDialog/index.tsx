import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text16, Title3 } from '@core/atoms/typography';
import Dialog from '@core/components/dialog';
// import VerifyPhoneNumber from '@core/components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { laptopAndAbove } from '@core/style/mediaQuery';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: 0 var(--triple-unit) var(--triple-unit) var(--triple-unit);
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;
const Centered = styled(Title3)`
  text-align: center;
`;

const messages = defineMessages({
  title: {
    id: 'football.noCardEntry.title',
    defaultMessage: 'No Card Entry',
  },
});

type Props = {
  open: boolean;
  onClose: () => void;
  poolDetail?: ReactNode;
};
export const NoCardEntryInfoDialog = ({ open, onClose, poolDetail }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const [showVerify, setShowVerify] = useState(false);
  return (
    <>
      {showVerify && (
        // <VerifyPhoneNumber onCancel={() => setShowVerify(false)} />
        <>VerifyPhoneNumber555</>
      )}
      <Dialog
        maxWidth={false}
        open={open}
        onClose={onClose}
        title={
          <Centered>
            <FormattedMessage {...messages.title} />
          </Centered>
        }
        body={
          <Body>
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage
                id="NoCardEntryInfoDialog.title"
                defaultMessage={`If you have not entered a lineup in a competition that requires NFT cards, you can participate in this Game Week without cards by clicking on the “No Card entry” button once the Entry Period is closed.{br}
        To participate, you will have to send an email and follow the instructions (including submitting a proof of residence) to select a team within a 45 minutes window.`}
                values={{
                  br: <br />,
                }}
              />
            </Text16>
            {poolDetail && (
              <Text16 color="var(--c-neutral-600)">{poolDetail}</Text16>
            )}
            {!currentUser?.phoneNumberVerified && (
              <Centered>
                <Button color="darkGray" onClick={() => setShowVerify(true)}>
                  <FormattedMessage
                    id="NoCardEntryInfoDialog.verifyPhoneNumber"
                    defaultMessage="Verify your phone number to be eligible"
                  />
                </Button>
              </Centered>
            )}
          </Body>
        }
      />
    </>
  );
};
