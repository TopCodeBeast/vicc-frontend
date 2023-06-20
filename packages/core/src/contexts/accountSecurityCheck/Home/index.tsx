import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';

import { PhoneNumber } from './PhoneNumber';
import { RecoveryEmail } from './RecoveryEmail';
import { TwoFA } from './TwoFA';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Center = styled.div`
  text-align: center;
`;

const Blocks = styled.div`
  border: solid 1px var(--c-neutral-400);
  border-radius: var(--double-unit);
`;

const Block = styled.div`
  padding: var(--double-unit);
  &:not(:last-child) {
    border-bottom: solid 1px var(--c-neutral-400);
  }
`;

type Props = {
  onClose: () => void;
};
export const Home = ({ onClose }: Props) => {
  return (
    <Content>
      <Header>
        <Center>
          <Title3 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="accountSecurityCheck.title"
              defaultMessage="Account Security Overview"
            />
          </Title3>
          <Text16 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="accountSecurityCheck.subtitle"
              defaultMessage="Please review and confirm your account security preferences below. Consider adding missing information to ensure you keep your account secure and avoid getting locked out."
            />
          </Text16>
        </Center>
      </Header>
      <Blocks>
        <Block>
          <RecoveryEmail />
        </Block>
        <Block>
          <TwoFA />
        </Block>
        <Block>
          <PhoneNumber />
        </Block>
      </Blocks>
      <Button medium onClick={onClose} color="blue">
        <FormattedMessage {...glossary.confirm} />
      </Button>
    </Content>
  );
};

export default Home;
