import { ReactNode } from 'react';
import styled from 'styled-components';

import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Title6 } from '@sorare/core/src/atoms/typography';
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
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  > * {
    width: 100%;
  }
`;

const DirectOfferDialog = ({ title, content, onClose, actions }: Props) => {
  const { up: tablet } = useScreenSize('tablet');

  return (
    <Dialog
      open
      title={<Title6>{title}</Title6>}
      onClose={onClose}
      fullScreen={!tablet}
      headerCentered
    >
      <Content>
        {content}
        <Actions>{actions}</Actions>
      </Content>
    </Dialog>
  );
};

export default DirectOfferDialog;
