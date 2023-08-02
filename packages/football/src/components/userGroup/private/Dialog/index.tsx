import { FormattedMessage } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import {
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  PrivateLeaguesStep,
} from '@sorare/core/src/constants/routes';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import CreateOrJoin from '@football/components/userGroup/private/Dialog/CreateOrJoin';

import Congrats from './Steps/Congrats';
import { CreatePrivateUserGroup } from './Steps/CreatePrivateUserGroup';

const Body = styled.div`
  height: 100%;
  padding: 0 var(--triple-unit) var(--triple-unit) var(--triple-unit);
  @media ${laptopAndAbove} {
    width: var(--layout-dialog-width);
  }
`;
const CenteredText16 = styled(Text16)`
  text-align: center;
`;

type DialogProps = {
  title?: React.JSX.Element;
  body: React.JSX.Element;
  onBack?: () => void;
};
const PrivateUserGroupDialog = () => {
  const { step } = useParams();
  const navigate = useNavigate();

  const onClose = () => {
    navigate(FOOTBALL_PRIVATE_LEAGUES);
  };

  let dialogProps: DialogProps = {
    body: (
      <CreateOrJoin
        next={() => {
          navigate(
            generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATE, {
              step: PrivateLeaguesStep.CREATE_FORM,
            })
          );
        }}
      />
    ),
  };

  if (step === PrivateLeaguesStep.CREATE_FORM) {
    dialogProps = {
      title: (
        <CenteredText16>
          <FormattedMessage
            id="UserGroups.create.title"
            defaultMessage="Create a league"
          />
        </CenteredText16>
      ),
      onBack: () => {
        navigate(
          generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATE, {
            step: PrivateLeaguesStep.CREATE,
          })
        );
      },
      body: <CreatePrivateUserGroup />,
    };
  }
  if (step === PrivateLeaguesStep.CONGRATS) {
    dialogProps = {
      body: <Congrats />,
    };
  }

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      {...dialogProps}
      body={<Body>{dialogProps.body}</Body>}
    />
  );
};

export default PrivateUserGroupDialog;
