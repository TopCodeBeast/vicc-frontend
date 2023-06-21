import { faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Dialog from '@core/atoms/layout/Dialog';
import { Text16 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import {
  SIGNUP_WORKFLOW_VERSION_QUERY_PARAMETER,
  isVersion2OrGreater,
  isVersion4OrGreater,
} from '@core/constants/mobile';
import { useIntlContext } from '@core/contexts/intl';
import useQueryString from '@core/hooks/useQueryString';
import { theme } from '@core/style/theme';
import 'style/drukFontFaces.css';

import V4Body from './V4Body';

const messages = defineMessages({
  title: {
    id: 'SignUpSuccessMobileViewDialog.title',
    defaultMessage: 'Check your email',
  },
  description: {
    id: 'SignUpSuccessMobileViewDialog.description',
    defaultMessage:
      'Click the link we’ve sent to <b>{email}</b> to confirm your email',
  },
  openMailApp: {
    id: 'SignUpSuccessMobileViewDialog.openMailApp',
    defaultMessage: 'Open mail app',
  },
});

const IconCtn = styled.div`
  border-radius: ${theme.radius.circle};
  background-color: var(--c-neutral-600);
  width: ${theme.spacing(7)}px;
  height: ${theme.spacing(7)}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Icon = styled(FontAwesomeIcon)`
  font: var(--t-32);
  color: var(--c-neutral-100);
  display: inline;
`;

const Title = styled.h1`
  ${theme.styledFonts.drukWideSuper}
  font-size: 32px;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  height: 100%;
  padding: var(--double-unit);
  padding-top: calc(6 * var(--unit));
  justify-content: flex-end;
`;

type Props = { email: string | undefined };

const V1Body = ({ email }: Props) => {
  return (
    <>
      <IconCtn>
        <Icon icon={faEnvelope} />
      </IconCtn>
      <Title>
        <FormattedMessage {...messages.title} />
      </Title>
      <Text16>
        <FormattedMessage
          {...messages.description}
          values={{
            b: Bold,
            email,
          }}
        />
      </Text16>
    </>
  );
};

const V2Body = ({ email }: Props) => {
  const { formatMessage } = useIntlContext();
  return (
    <>
      <V1Body email={email} />
      <Button href="sorare://open-mail-app" color="blue">
        {formatMessage(messages.openMailApp)}
      </Button>
    </>
  );
};

const Body = (props: Props) => {
  const version = useQueryString(SIGNUP_WORKFLOW_VERSION_QUERY_PARAMETER);
  if (isVersion4OrGreater(version)) {
    return <V4Body />;
  }
  if (isVersion2OrGreater(version)) {
    return <V2Body {...props} />;
  }
  return <V1Body {...props} />;
};

const SignUpSuccessMobileViewDialog = ({ email }: Props) => {
  return (
    <Dialog noHeader noMargin fullScreen scroll="body" open>
      <Content>
        <Body email={email} />
      </Content>
    </Dialog>
  );
};

export default SignUpSuccessMobileViewDialog;
