import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Button } from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { PickerCard } from '@football/components/draft/PickerCard';
import { Draft } from '@football/pages/Draft/useDraftReducer';

const PickerCardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
  margin: var(--double-unit) 0;
  pointer-events: none;
`;
const DialogContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--double-unit);
  padding: 0 var(--triple-unit) var(--triple-unit) var(--triple-unit);
  text-align: center;
  @media ${laptopAndAbove} {
    width: var(--layout-dialog-width);
  }
`;

type Props = {
  onClose: () => void;
  selectedInvalidPlayers: Draft;
};
const MaxPlayerPerTeamDialog = ({ onClose, selectedInvalidPlayers }: Props) => {
  return (
    <Dialog
      open
      maxWidth="sm"
      onClose={onClose}
      body={
        <DialogContainer>
          <div>
            <PickerCardContainer>
              {selectedInvalidPlayers.map(({ position, drafted }) => (
                <PickerCard
                  error
                  key={drafted!.id}
                  position={position}
                  drafted={drafted}
                />
              ))}
            </PickerCardContainer>

            <Title3>
              <FormattedMessage
                id="draft.maxPlayerErrorDialog.title"
                defaultMessage="You can draft 2 players max per club"
              />
            </Title3>

            <Text16>
              <FormattedMessage
                id="draft.maxPlayerErrorDialog.message"
                defaultMessage="You drafted {playerCount} players from {team}. Select up to 2 players per club to continue."
                values={{
                  playerCount: selectedInvalidPlayers.length,
                  team: selectedInvalidPlayers[0].drafted?.team.name,
                }}
              />
            </Text16>
          </div>

          <Button medium fullWidth color="blue" onClick={onClose}>
            <FormattedMessage
              id="draft.maxPlayerErrorDialog.cta"
              defaultMessage="Got it"
            />
          </Button>
        </DialogContainer>
      }
    />
  );
};

export default MaxPlayerPerTeamDialog;
