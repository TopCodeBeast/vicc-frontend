import { type CalendarEvent } from 'calendar-link';
import styled from 'styled-components';

import { AddToCalendarButton } from '@core/atoms/buttons/AddToCalendarButton';
import CloseButton from '@core/atoms/buttons/CloseButton';
import { Text16, Text20 } from '@core/atoms/typography';
import Dialog from '@core/components/dialog';
import { laptopAndAbove } from '@core/style/mediaQuery';

const DialogContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;
const CloseButtonWrapper = styled.div`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
`;
const Header = styled.div<{
  $bgImage: string;
}>`
  min-height: 175px;
  background-position: center center;
  background-size: cover;
  background-image: ${({ $bgImage }) => `url(${$bgImage})`};
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--triple-unit);
  gap: var(--double-unit);
  text-align: center;
`;
const StyledText20 = styled(Text20)`
  font-weight: 900;
`;
const Footer = styled.div`
  padding: var(--triple-unit);
`;

export const AuctionDropModal = ({
  open,
  onClose,
  backgroundImage,
  title,
  description,
  event,
}: {
  open: boolean;
  onClose: () => void;
  backgroundImage: string;
  title: string;
  description: string;
  event: CalendarEvent;
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <DialogContainer>
        <CloseButtonWrapper>
          <CloseButton onClose={onClose} />
        </CloseButtonWrapper>
        <div>
          <Header $bgImage={backgroundImage} />
          <Body>
            <StyledText20>{title}</StyledText20>
            <Text16 color="var(--c-neutral-600)">{description}</Text16>
          </Body>
        </div>
        <Footer>
          <AddToCalendarButton event={event} />
        </Footer>
      </DialogContainer>
    </Dialog>
  );
};
