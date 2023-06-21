import { ReactNode } from 'react';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

export type Props = {
  title: ReactNode;
  onClose: () => void;
  content: ReactNode;
  actions: ReactNode;
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: 0 var(--triple-unit);
`;
const CenteredTitle6 = styled(Title6)`
  text-align: center;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--triple-unit);
  > * {
    width: 100%;
  }
`;

const DirectOfferDialog = ({ title, content, onClose, actions }: Props) => {
  const { up: tablet } = useScreenSize('tablet');

  return (
    <Dialog
      open
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      fullScreen={!tablet}
      title={<CenteredTitle6>{title}</CenteredTitle6>}
      body={<Content>{content}</Content>}
      footer={<Actions>{actions}</Actions>}
    />
  );
};

export default DirectOfferDialog;
