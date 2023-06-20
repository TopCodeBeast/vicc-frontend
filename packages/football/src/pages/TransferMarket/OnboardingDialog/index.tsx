import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { OneTimeDialog } from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

const Cover = styled.div<{ img: string; imgDesktop: string }>`
  background-position: center;
  background-size: cover;
  aspect-ratio: 1;
  ${({ img }) => `background-image: url(${img});`}

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    aspect-ratio: 2;
    ${({ imgDesktop }) => `background-image: url(${imgDesktop});`}
  }
`;

const Content = styled.div`
  padding: var(--double-unit);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);

  > *:last-child {
    margin-top: var(--double-unit);
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      align-self: center;
    }
  }
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: var(--double-unit);
  right: var(--double-unit);
`;

export const OnboardingDialog = ({
  title,
  description,
  img,
  imgDesktop = img,
  open,
  onClose,
}: {
  title: MessageDescriptor;
  description: MessageDescriptor;
  img: string;
  imgDesktop?: string;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog maxWidth="sm" open={open} onClose={onClose} darkTheme>
      <>
        <CloseButtonWrapper>
          <CloseButton onClose={onClose} />
        </CloseButtonWrapper>
        <Cover img={img} imgDesktop={imgDesktop} />
        <Content>
          <Title2>
            <FormattedMessage {...title} />
          </Title2>
          <Text16 color="var(--c-neutral-500)">
            <FormattedMessage {...description} />
          </Text16>
          <Button medium color="blue" onClick={onClose}>
            <FormattedMessage {...glossary.discover} />
          </Button>
        </Content>
      </>
    </Dialog>
  );
};

const OneTimeOnboardingDialog = ({
  lifecycleKey,
  show,
  open: isOpen,
  onClick,
  ...rest
}: {
  title: MessageDescriptor;
  description: MessageDescriptor;
  img: string;
  imgDesktop?: string;
  lifecycleKey: LIFECYCLE;
  show: boolean;
  open: boolean;
  onClick: () => void;
}) => {
  if (isOpen)
    return <OnboardingDialog onClose={onClick} open={isOpen} {...rest} />;
  return (
    <OneTimeDialog dialogId={lifecycleKey} show={show}>
      {({ onClose, open }) => (
        <OnboardingDialog onClose={onClose} open={open} {...rest} />
      )}
    </OneTimeDialog>
  );
};

export default OneTimeOnboardingDialog;
