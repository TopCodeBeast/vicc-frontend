import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16, Title3 } from '@core/atoms/typography';
import Dialog from '@core/components/dialog';
import { glossary } from '@core/lib/glossary';
import { laptopAndAbove } from '@core/style/mediaQuery';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--triple-unit);
  margin: auto;
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;

const EmailContent = styled(Text16)`
  text-align: left;
  border-radius: var(--unit);
  padding: var(--double-unit);
  background: var(--c-neutral-300);

  .dark-theme & {
    color: var(--c-neutral-600);
    background: var(--c-neutral-100);
  }
`;

const HeaderButton = styled(IconButton)`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
`;

const Block = styled.div`
  gap: var(--triple-unit);
`;

const Centered = styled(Title3)`
  text-align: center;
`;

const Subtitle = styled(Text16)`
  color: var(--c-neutral-600);
`;

const Timer = styled.div`
  display: flex;
  font: var(--t-12);
  justify-content: center;
  margin-top: var(--double-unit);
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const messages = defineMessages({
  title: {
    id: 'NoCardEntryRegisterDialog.title',
    defaultMessage: 'No Card Entry',
  },
});

type Props = {
  emailAddress: string | undefined;
  open: boolean;
  onClose: () => void;
  maxLineupsPerUser: number | undefined;
  poolDetail?: ReactNode;
  timer?: ReactNode;
  loading?: boolean;
};

export const NoCardEntryRegisterDialog = ({
  emailAddress,
  open,
  onClose,
  maxLineupsPerUser,
  poolDetail,
  timer,
  loading,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      <DialogContainer>
        <HeaderButton
          onClick={onClose}
          type="button"
          color="darkGray"
          aria-label={formatMessage(glossary.close)}
        >
          <FontAwesomeIcon color="black" icon={faTimes} size="lg" />
        </HeaderButton>
        <Block>
          <Centered>
            <FormattedMessage {...messages.title} />
          </Centered>
        </Block>
        {loading ? (
          <LoaderWrapper>
            <LoadingIndicator />
          </LoaderWrapper>
        ) : (
          <>
            <Block>
              <Subtitle>
                <FormattedMessage
                  id="NoCardEntryRegisterDialog.subtitle1"
                  defaultMessage="You can play in this Game Week without owning NFT cards by selecting a team of players among those Vicc will give you access to."
                />
              </Subtitle>
            </Block>
            <Block>
              <Subtitle>
                <FormattedMessage
                  id="NoCardEntryRegisterDialog.subtitle2"
                  defaultMessage="For this Game Week, you will be entitled to select until {maxLineupsPerUser} teams of players by following the process described below."
                  values={{ maxLineupsPerUser }}
                />
              </Subtitle>
            </Block>
            {poolDetail && (
              <Block>
                <Subtitle>{poolDetail}</Subtitle>
              </Block>
            )}
            <Block>
              <Text16>
                <FormattedMessage
                  id="NoCardEntryRegisterDialog.subtitle3"
                  defaultMessage={`To participate:{br}
                             1. Send an email to {email}{br}
                             2. Use the following template:`}
                  values={{
                    br: <br />,
                    email: (
                      <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                    ),
                  }}
                />
              </Text16>
            </Block>
            <Block>
              <EmailContent>
                Je, soussigné, prénom nom, inscrit sur Vicc avec l’email XXXX
                et le nom d’utilisateur XXX souhaite obtenir le lien de
                participation à la gameweek.
              </EmailContent>
            </Block>
            <Block>
              <Text16>
                <FormattedMessage
                  id="NoCardEntryRegisterDialog.subtitle4"
                  defaultMessage="3. Check your inbox (and the spams folder)"
                />
              </Text16>
            </Block>
            {timer && (
              <Block>
                <Timer>{timer}</Timer>
              </Block>
            )}
          </>
        )}
      </DialogContainer>
    </Dialog>
  );
};
