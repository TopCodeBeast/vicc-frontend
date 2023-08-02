import { MouseEvent, useState } from 'react';
import styled from 'styled-components';

import VerifyPhoneNumber from '@core/components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useEvents from '@core/lib/events/useEvents';

const Wrapper = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
  &:empty {
    display: none;
  }
`;

type Props = {
  hasBlockchainRewards: boolean;
  trackProperties?: {
    gameweek?: number;
  };
  children: ({
    disabledClaim,
  }: {
    disabledClaim: boolean;
  }) => React.JSX.Element;
};

export const ShouldVerifyUserBeforeClaiming = ({
  hasBlockchainRewards,
  trackProperties,
  children,
}: Props) => {
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
