import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const SeparatorContainer = styled.div`
  display: flex;
  align-items: center;

  &::before,
  &::after {
    flex: 1;
    height: 1px;
    background: var(--c-static-neutral-100);
    content: '';
  }
  &::before {
    margin-right: var(--double-unit);
  }
  &::after {
    margin-left: var(--double-unit);
  }
`;
const TextCenter = styled.div`
  text-align: center;
`;

const Separator = () => (
  <SeparatorContainer>
    <TextCenter>
      <strong>
        <FormattedMessage
          id="Bundle.StarterBundleDialog.Or"
          defaultMessage="Or"
        />
      </strong>
    </TextCenter>
  </SeparatorContainer>
);

export default Separator;
