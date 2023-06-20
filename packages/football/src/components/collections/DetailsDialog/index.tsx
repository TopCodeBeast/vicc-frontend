import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Text16, Title2, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';

import DetailedScoreLine, {
  DetailedScoreKey,
  detailedScores,
} from '@sorare/football/src/components/collections/DetailedScoreLine';
import ProgressBar from '@sorare/football/src/components/collections/ProgressBar';
import Warning from '@sorare/football/src/components/collections/Warning';

const Root = styled.div`
  padding: var(--quadruple-unit);
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--double-unit);
  background: var(--c-neutral-300);
`;
const Close = styled(CloseButton)`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
`;

type Props = {
  onClose: () => void;
  open: boolean;
};
const DetailsDialog = ({ onClose, open }: Props) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <Root>
        <header>
          <Title2>
            <FormattedMessage
              id="collections.DetailsDialog.title"
              defaultMessage="The Collection Game"
            />
          </Title2>
          <Close onClose={onClose} />
        </header>
        <div>
          <Title3>
            <FormattedMessage
              id="collections.DetailsDialog.section1.title"
              defaultMessage="The Collection Scoring Matrix"
            />
          </Title3>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage
              id="collections.DetailsDialog.section1.description"
              defaultMessage="Each card has a collection score based on the following"
            />
          </Text16>
        </div>
        <List>
          {Object.keys(detailedScores).map(id => (
            <DetailedScoreLine key={id} id={id as DetailedScoreKey} />
          ))}
        </List>
        <Warning />
        <div>
          <Title3>
            <FormattedMessage
              id="collections.DetailsDialog.section2.title"
              defaultMessage="The Collection Bonus"
            />
          </Title3>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage
              id="collections.DetailsDialog.section2.description"
              defaultMessage="An additional scoring bonus on a player’s in-game score – will apply in competitions where XP applies"
            />
          </Text16>
        </div>
        <ProgressBar showLabel disableAnimation />
      </Root>
    </Dialog>
  );
};

export default DetailsDialog;
