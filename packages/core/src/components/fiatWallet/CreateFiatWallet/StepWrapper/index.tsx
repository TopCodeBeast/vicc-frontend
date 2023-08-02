import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@core/atoms/buttons/ButtonBase';
import { glossary } from '@core/lib/glossary';

import { CreateFiatWalletSteps } from '../type';
import { useBackButtonTargets } from '../useBackButtonTargets';

const Root = styled.div`
  flex-grow: 1;
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

type Props = {
  children: ReactNode;
  submitButton: ReactNode;
  step: CreateFiatWalletSteps;
  setStep: (step: CreateFiatWalletSteps) => void;
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  height: 100%;
`;
const StyledButtonBase = styled(ButtonBase)`
  text-decoration: underline;
`;

const StepWrapper = ({ children, step, setStep, submitButton }: Props) => {
  const backTargets = useBackButtonTargets({});
  const backTarget = backTargets[step];
  return (
    <Content>
      {children}
      <Root>
        {submitButton}
        {backTarget && (
          <StyledButtonBase onClick={() => setStep(backTarget)}>
            <FormattedMessage {...glossary.back} />
          </StyledButtonBase>
        )}
      </Root>
    </Content>
  );
};

export default StepWrapper;
