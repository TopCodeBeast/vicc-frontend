import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import styled from 'styled-components';

import EthInputWithConversion from '../../EthInputWithConversion';
import Field from '../Field';

interface Props {
  onChange?: (value: any) => void;
  name: string;
  label?: string;
  defaultEthValue?: string;
  minEthValue?: number;
}

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;
const Input = styled.div`
  margin: 20px 0px 10px;
`;

const TextFieldWithConversion = ({
  defaultEthValue = '0.01',
  minEthValue = 0,
  onChange = () => {},
  name,
  label,
}: Props) => {
  return (
    <Field
      name={name}
      defaultValue={defaultEthValue}
      render={({ error, handleChange }) => (
        <StyledFormControl error={!!error}>
          <InputLabel error={!!error} shrink>
            {label}
          </InputLabel>
          <Input>
            <EthInputWithConversion
              initialValue={defaultEthValue}
              minEthValue={minEthValue}
              onChange={value => {
                onChange(value);
                handleChange(name)({ target: { value } });
              }}
            />
          </Input>
        </StyledFormControl>
      )}
    />
  );
};

export default TextFieldWithConversion;
