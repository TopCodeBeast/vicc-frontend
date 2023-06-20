import { gql } from '@apollo/client';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox } from '@material-ui/core';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Actions } from '@sorare/core/src/atoms/layout/Dialog';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { GraphQLResult, GraphqlForm, TextField } from 'components/form/Form';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';

type Props = {
  onSubmit: ({
    name,
    visible,
  }: {
    name: string;
    visible: boolean;
  }) => Promise<any>;
  onSuccess: () => void;
  children?: ReactNode;
  deck?: { name: string; visible: boolean };
};

const messages = defineMessages({
  name: {
    id: 'deck.Form.name',
    defaultMessage: 'Name',
  },
  placeholder: {
    id: 'deck.Form.placeholder',
    defaultMessage: 'Enter a deck name',
  },
});

const Name = styled(TextField)`
  width: 100%;
  & .MuiOutlinedInput-root {
    .dark-theme & {
      background-color: var(--c-neutral-300);
    }
  }
`;
const KeepSecret = styled.div`
  padding: 20px 0px;
  display: flex;
  justify-content: space-between;
`;
const KeepSecretTitle = styled.div`
  display: flex;
  align-items: center;
`;
const Lock = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

export const Form = ({ onSubmit, onSuccess, children, deck }: Props) => {
  const { formatMessage } = useIntlContext();
  const [keepSecret, toggleKeepSecret] = useToggle(
    deck ? !deck.visible : false
  );

  const doOnSubmit = async (
    { name }: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const errors = await onSubmit({ name, visible: !keepSecret });

    onResult({ errors });
  };
  return (
    <GraphqlForm
      onSubmit={(attributes, onResult) => {
        doOnSubmit(attributes, onResult);
      }}
      onSuccess={onSuccess}
      render={(Error, SubmitButton) => (
        <>
          <Error />
          <Name
            placeholder={formatMessage(messages.placeholder)}
            name="name"
            label={formatMessage(messages.name)}
            defaultValue={deck?.name}
            maxLength={30}
          />
          <KeepSecret>
            <div>
              <KeepSecretTitle>
                <Lock icon={faLock} />
                <Text16 bold>
                  <FormattedMessage
                    id="deck.Form.keepSecret"
                    defaultMessage="Keep secret"
                  />
                </Text16>
              </KeepSecretTitle>
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage
                  id="deck.Form.keepSecretSubtitle"
                  defaultMessage="So only you can see it"
                />
              </Text16>
            </div>
            <Checkbox checked={keepSecret} onChange={toggleKeepSecret} />
          </KeepSecret>
          <Actions>
            {children && children}
            <SubmitButton>
              <FormattedMessage
                {...(deck ? glossary.update : glossary.create)}
              />
            </SubmitButton>
          </Actions>
        </>
      )}
    />
  );
};

Form.fragments = {
  card: gql`
    fragment Form_card on Card {
      slug
      assetId
    }
  `,
};

export default Form;
