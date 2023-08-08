import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Dialog from '@sorare/core/src/components/dialog';
import { glossary } from '@sorare/core/src/lib/glossary';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { StarterBundleFlow } from '../Flow';

const FullSize = styled.div`
  height: 100%;
  @media ${laptopAndAbove} {
    height: calc(100vh - 8 * var(--unit));
  }
`;
const Actions = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
`;

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};
export const StarterBundleDialog = ({ open, children, onClose }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      hideHeader
      maxWidth={false}
      body={
        <>
          <FullSize>
            <StarterBundleFlow>{children}</StarterBundleFlow>
          </FullSize>
          <Actions>
            <IconButton
              onClick={onClose}
              color="white"
              icon={faTimes}
              aria-label={formatMessage(glossary.close)}
            />
          </Actions>
        </>
      }
    />
  );
};
