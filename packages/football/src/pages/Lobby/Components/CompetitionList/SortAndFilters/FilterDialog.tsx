import { faAngleDown, faSort } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import AtomButton from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';

const Root = styled.div`
  padding: var(--triple-unit);
`;
const CenteredText16 = styled(Text16)`
  text-align: center;
`;
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

  const onClose = () => {
    onCloseWithoutSaving();
    setOpen(false);
  };

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
        onClose={onClose}
        title={<CenteredText16 bold>{headerLabel}</CenteredText16>}
        body={<Root>{children}</Root>}
        footer={
          <Root>
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
          </Root>
        }
      />
    </>
  );
};
