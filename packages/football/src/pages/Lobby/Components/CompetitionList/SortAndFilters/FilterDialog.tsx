import { faAngleDown, faSort } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import AtomButton from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { MLHeader } from '@sorare/core/src/atoms/layout/Dialog/Headers/ML';

const Button = styled(AtomButton)`
  > * {
    display: flex;
    justify-content: space-between;
  }
`;
type Props = {
  buttonLabel: ReactNode;
  onCloseWithoutSaving: () => void;
  headerLabel: string;
  noSort?: boolean;
  onSave: () => void;
  saveLabel: ReactNode;
  children: ReactNode;
};
export const FilterDialog = ({
  buttonLabel,
  onCloseWithoutSaving,
  headerLabel,
  noSort,
  onSave,
  saveLabel,
  children,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} color="gray" medium fullWidth>
        {!noSort && <FontAwesomeIcon icon={faSort} />}
        {buttonLabel}
        <FontAwesomeIcon icon={faAngleDown} />
      </Button>
      <Dialog
        open={open}
        fullScreen
        header={
          <MLHeader
            onClose={() => {
              onCloseWithoutSaving();
              setOpen(false);
            }}
            label={headerLabel}
          />
        }
        footer={
          <AtomButton
            onClick={() => {
              onSave();
              setOpen(false);
            }}
            fullWidth
            color="black"
            medium
          >
            {saveLabel}
          </AtomButton>
        }
      >
        {children}
      </Dialog>
    </>
  );
};
