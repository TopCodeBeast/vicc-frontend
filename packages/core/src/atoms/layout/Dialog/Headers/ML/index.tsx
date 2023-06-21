import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';

const Root = styled.header`
  text-align: center;
  position: relative;
  color: var(--c-neutral-1000);
`;
const Close = styled(IconButton)`
  position: absolute;
  left: 10px;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  &:hover {
    background: var(--c-neutral-300);
  }
`;
const Label = styled.div`
  text-transform: uppercase;
  font-style: italic;
  padding: 15px 40px;
`;

export const MLHeader = (props: { label: string; onClose?: () => void }) => {
  const { label, onClose } = props;
  return (
    <Root>
      {!!onClose && (
        <Close onClick={onClose} type="button" color="white" icon={faTimes} />
      )}
      <Label>{label}</Label>
    </Root>
  );
};
