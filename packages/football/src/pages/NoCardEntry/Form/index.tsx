import { useEffect, useState } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title3, Title5 } from '@sorare/core/src/atoms/typography';
import { goToLobby } from '@sorare/core/src/constants/routes';

import Header from '@football/pages/NoCardEntry/Header';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;
const CenteredFlexContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  align-items: center;
`;

type Props = {
  mutate: () => Promise<boolean>;
  title?: MessageDescriptor;
  subtitle?: MessageDescriptor;
  postAction?: 'lobby' | 'email';
};

const Form = ({ mutate, title, subtitle, postAction }: Props) => {
  const [mutationStarted, setMutationStarted] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!mutationStarted) {
      setMutationStarted(true);
      mutate().then(setSuccess);
    }
  }, [mutationStarted, mutate]);

  return (
    <Root className="light-theme">
      <Header />
      {success === null && <LoadingIndicator />}
      <CenteredFlexContainer>
        {success && (
          <>
            {title && (
              <Title3>
                <FormattedMessage {...title} />
              </Title3>
            )}
            {subtitle && (
              <Title5>
                <FormattedMessage {...subtitle} />
              </Title5>
            )}
          </>
        )}
        {success === false && (
          <Title3>
            <FormattedMessage
              id="NoCardEntry.Form.errorTitle"
              defaultMessage="An error occured"
            />
          </Title3>
        )}
        {postAction === 'lobby' && (
          <Button
            component={Link}
            to={goToLobby('upcoming')}
            color="blue"
            medium
          >
            <FormattedMessage
              id="NoCardEntry.Form.Cta.title"
              defaultMessage="Go back to the lobby"
            />
          </Button>
        )}
        {postAction === 'email' && (
          <Title3>
            <FormattedMessage
              id="NoCardEntry.Form.email"
              defaultMessage="Please check your emails"
            />
          </Title3>
        )}
      </CenteredFlexContainer>
    </Root>
  );
};

export default Form;
