import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title4 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

// import MatchView from '@football/components/MatchView';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--unit) var(--triple-unit) var(--triple-unit);
  gap: var(--double-unit);
  height: 100%;

  @media ${laptopAndAbove} {
    min-width: var(--layout-dialog-width);
  }
`;
const CenteredTitle4 = styled(Title4)`
  text-align: center;
`;

type Props = {
  gameId?: string;
  onClose: () => void;
  open?: boolean;
};
const MatchViewDialog = ({ gameId, onClose, open }: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');
  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={onClose}
      title={
        <CenteredTitle4>
          <FormattedMessage
            id="MatchViewDialog.Title"
            defaultMessage="Match view"
          />
        </CenteredTitle4>
      }
      body={
        <DialogContainer>
          {/* {open && gameId && <MatchView desktop={isLaptop} id={gameId} />} */}
          {open && gameId && <>MatchView5555</>}
        </DialogContainer>
      }
    />
  );
};

export default MatchViewDialog;
