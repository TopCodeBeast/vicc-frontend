import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Title2 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { useOneTimeDialogContext } from '@sorare/core/src/contexts/oneTimeDialog';
import { OneTimeDialog } from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';
import { glossary } from '@sorare/core/src/lib/glossary';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  padding: var(--quadruple-unit);
  align-items: center;
  margin: auto;
`;
const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  text-align: center;
`;
const Subtitle = styled(Text14)`
  color: var(--c-neutral-700);
`;
const LongLiveTheSquads = () => {
  const {
    flags: { useCustomLists = false, useShowCustomListTuto = false },
  } = useFeatureFlags();
  const { sawDialog } = useOneTimeDialogContext();

  if (!(useShowCustomListTuto && useCustomLists)) {
    return null;
  }

  return (
    <OneTimeDialog
      dialogId={LIFECYCLE.sawNewCustomListTuto}
      show={!sawDialog(LIFECYCLE.sawNewCustomListTuto)}
    >
      {({ onClose, open }) => (
        <Dialog
          maxWidth="xs"
          open={open}
          body={
            <Body>
              <Text>
                <Title2>
                  <FormattedMessage
                    id="LongLiveTheSquads.title"
                    defaultMessage="The Squad feature has moved"
                  />
                </Title2>
                <Subtitle>
                  <FormattedMessage
                    id="LongLiveTheSquads.subtitle"
                    defaultMessage="You can now create squad lists directly in your Card Gallery. Your lists will be seen by other Managers visiting your card gallery. You can also use these lists as filters when building your lineups."
                  />
                </Subtitle>
              </Text>
              <Button onClick={onClose} color="blue" medium fullWidth>
                <FormattedMessage {...glossary.gotIt} />
              </Button>
            </Body>
          }
        />
      )}
    </OneTimeDialog>
  );
};

export default LongLiveTheSquads;
