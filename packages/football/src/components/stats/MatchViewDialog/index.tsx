import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { theme } from '@sorare/core/src/style/theme';

import MatchView from '@sorare/football/src/components/MatchView';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--double-unit) var(--unit) var(--unit);
  gap: var(--double-unit);
  height: 100%;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    min-width: ${theme.layout.dialogWidth}px;
    height: auto;
  }
`;
const Header = styled.div`
  text-align: center;
`;
const CloseButtonWrapper = styled.div`
  position: absolute;
  top: var(--unit);
  right: var(--double-unit);
`;

type Props = {
  gameId?: string;
  onClose: () => void;
  open?: boolean;
};
const MatchViewDialog = ({ gameId, onClose, open }: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');
  return (
    <Dialog open={open} maxWidth={false} onClose={onClose}>
      <>
        <CloseButtonWrapper>
          <CloseButton onClose={onClose} />
        </CloseButtonWrapper>
        <DialogContainer>
          <Header>
            <Title3>
              <FormattedMessage
                id="MatchViewDialog.Title"
                defaultMessage="Match view"
              />
            </Title3>
          </Header>
          {open && gameId && <MatchView desktop={isLaptop} id={gameId} />}
        </DialogContainer>
      </>
    </Dialog>
  );
};

export default MatchViewDialog;
