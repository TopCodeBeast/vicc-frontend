import { MouseEvent, useState } from 'react';
import styled from 'styled-components';

import VerifyPhoneNumber from 'components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useEvents from '@sorare/core/src/lib/events/useEvents';

const Wrapper = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
  &:empty {
    display: none;
  }
`;

export const ShouldVerifyUserBeforeClaiming: React.FC<{
  hasBlockchainRewards: boolean;
  trackProperties?: {
    gameweek?: number;
  };
  children: ({ disabledClaim }: { disabledClaim: boolean }) => JSX.Element;
}> = ({ hasBlockchainRewards, trackProperties, children }) => {
  const track = useEvents();
  const { currentUser } = useCurrentUserContext();
  const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);

  const shouldVerifyPhone =
    hasBlockchainRewards && !currentUser?.phoneNumberVerified;

  const onClick = (e: MouseEvent<HTMLElement>) => {
    track('Click rewards banner', trackProperties);

    if (shouldVerifyPhone) {
      setVerifyPhoneNumber(true);
      e.stopPropagation();
    }
  };

  return (
    <>
      {verifyPhoneNumber && (
        <VerifyPhoneNumber onCancel={() => setVerifyPhoneNumber(false)} />
      )}
      <Wrapper onClickCapture={onClick}>
        {children({ disabledClaim: shouldVerifyPhone })}
      </Wrapper>
    </>
  );
};
