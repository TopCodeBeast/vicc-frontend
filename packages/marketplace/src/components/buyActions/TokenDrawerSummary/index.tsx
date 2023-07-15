import { ReactNode } from 'react';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Drawer } from '@sorare/core/src/atoms/layout/Drawer';

const DrawerContent = styled.div`
  padding: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  background-color: var(--c-neutral-100);
  border-top-left-radius: var(--double-unit);
  border-top-right-radius: var(--double-unit);
`;

const DrawerHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--double-unit);
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const DrawerTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--double-unit);
`;

type Props = {
  open: boolean;
  onBackdropClick: () => void;
  title?: ReactNode;
  children?: ReactNode;
};

const TokenDrawerSummary = ({
  title,
  children,
  open,
  onBackdropClick,
}: Props) => (
  <Drawer open={open} onBackdropClick={onBackdropClick} side="bottom">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <CloseButton menu onClose={onBackdropClick} />
      </DrawerHeader>
      {children}
    </DrawerContent>
  </Drawer>
);

export default TokenDrawerSummary;
