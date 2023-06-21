import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Confetti from '@sorare/core/src/atoms/animations/Confetti';
import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import {
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  PrivateLeaguesStep,
} from '@sorare/core/src/constants/routes';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: calc(3 * var(--unit));
  margin: auto;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: 480px;
  }
`;
const HeaderButton = styled(IconButton)`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
`;
const Checkmark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: 3px solid rgba(var(--c-rgb-neutral-1000), 0.2);
  margin: auto;
`;
const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
`;
const Block = styled(FlexColumnContainer)`
  gap: calc(3 * var(--unit));
`;
const Centered = styled(Title3)`
  text-align: center;
`;
const Subtitle = styled(Text16)`
  text-align: center;
  color: var(--c-neutral-600);
`;
const BlueTextButton = styled(Button).attrs({ medium: true })`
  &,
  &:hover,
  &:focus {
    color: var(--c-brand-600);
  }
`;

type Props = { onClose: () => void; open: boolean };
const CongratsDialog = ({ onClose, open }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      <DialogContainer>
        <HeaderButton
          onClick={onClose}
          type="button"
          color="darkGray"
          aria-label={formatMessage(glossary.close)}
        >
          <FontAwesomeIcon color="black" icon={faTimes} size="lg" />
        </HeaderButton>
        <Block>
          <Checkmark>
            <FontAwesomeIcon icon={faCheck} size="lg" />
          </Checkmark>
          <Centered>
            <FormattedMessage
              id="competitionList.congratsDialog.title"
              defaultMessage="Congratulations{br}Your team is in!"
              values={{ br: <br /> }}
            />
          </Centered>
        </Block>
        <Block>
          <Subtitle>
            <FormattedMessage
              id="competitionList.congratsDialog.caption"
              defaultMessage="You can redraft anytime until the first matchday and create a league with your friends"
            />
          </Subtitle>

          <FlexColumnContainer>
            <Button
              component={Link}
              to={generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATE, {
                step: PrivateLeaguesStep.CREATE,
              })}
              onClick={() => onClose()}
              medium
              color="blue"
            >
              <FormattedMessage
                id="competitionList.congratsDialog.cta.createLeague"
                defaultMessage="Create a league"
              />
            </Button>
            <BlueTextButton onClick={onClose}>
              <strong>
                <FormattedMessage
                  id="competitionList.congratsDialog.cta.maybeLater"
                  defaultMessage="Maybe later"
                />
              </strong>
            </BlueTextButton>
          </FlexColumnContainer>
          <Confetti />
        </Block>
      </DialogContainer>
    </Dialog>
  );
};

export default CongratsDialog;
