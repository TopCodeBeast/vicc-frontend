import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title3 } from '@sorare/core/src/atoms/typography';
import { ErrorProps, images, levelOfErrorCode } from 'routing/HandledError';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: auto;
  padding: var(--double-unit);
  text-align: center;
`;
const Cta = styled(Button)`
  margin-top: var(--double-unit);
`;

export const HandledError = ({ code, message }: ErrorProps) => {
  const level = levelOfErrorCode(code);
  const navigate = useNavigate();

  const handleNavigate = () => navigate(-1);

  return (
    <Container>
      <div>{images[level]}</div>
      <Title3>{message}</Title3>
      <Cta onClick={handleNavigate} type="button" color="blue">
        <FormattedMessage
          id="DialogHandledError.GoBack"
          defaultMessage="Go Back"
        />
      </Cta>
    </Container>
  );
};

export default HandledError;
