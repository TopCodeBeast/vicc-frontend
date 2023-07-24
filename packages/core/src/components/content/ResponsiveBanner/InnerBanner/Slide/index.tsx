import { useState } from 'react';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text14, Text16 } from '@core/atoms/typography';
import ContentLink from '@core/components/content/ContentLink';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { SlideProps } from '../../types';
import { AuctionDropModal } from '../AuctionDropModal';
import { AuctionDropText } from '../AuctionDropText';

const StyledTitle = styled(Text16)`
  font-weight: var(--t-bolder);
`;

const StyledText14 = styled(Text14)`
  margin-bottom: var(--unit);
  opacity: 0.8;

  @media ${tabletAndAbove} {
    max-width: 50%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--unit);
`;
const Root = styled.div<{
  $dark?: boolean;
  $bgImage: string;
  $mobileBgImage: string;
}>`
  scroll-snap-align: center;
  width: 100%;
  flex-shrink: 0;
  padding: var(--triple-unit);
  background-image: ${({ $mobileBgImage }) => `url(${$mobileBgImage})`};
  background-position: center center;
  background-size: cover;

  border-radius: 18px;
  color: ${({ $dark }) => ($dark ? 'white' : 'inherit')};
  position: relative;
  overflow: hidden;

  min-height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(var(--c-static-rgb-neutral-1000), 0.4),
      transparent
    );
  }

  @media ${tabletAndAbove} {
    background-position: center right;
    background-image: ${({ $bgImage }) => `url(${$bgImage})`};
  }
`;
const TextContainer = styled.div`
  position: relative;
`;
const HideMobile = styled.div`
  display: none;

  @media ${tabletAndAbove} {
    display: inline-flex;
  }
`;

const StyledButton = styled(Button).attrs({
  small: true,
})``;

type Props = SlideProps & {
  track: () => void;
};

export const Slide = ({
  track,
  title,
  description,
  dark,
  backgroundImage,
  mobileBackgroundImage,
  primaryButton,
  secondaryButton,
  auctionDrop,
}: Props) => {
  const [auctionDropDialogOpen, setAuctionDropDialogOpen] = useState(false);
  const isAuctionDropLive = !!auctionDrop?.isLive;
  const actualPrimaryButton =
    (!isAuctionDropLive && auctionDrop?.livePrimaryButton) || primaryButton;

  return (
    <Root
      $dark={Boolean(dark)}
      $bgImage={backgroundImage}
      $mobileBgImage={mobileBackgroundImage}
    >
      <TextContainer>
        {auctionDrop && (
          <AuctionDropText
            live={isAuctionDropLive}
            date={isAuctionDropLive ? auctionDrop.end : auctionDrop.start}
          />
        )}
        <StyledTitle>{title}</StyledTitle>
        <StyledText14>{description}</StyledText14>
      </TextContainer>
      <Row>
        {auctionDrop && !isAuctionDropLive ? (
          <StyledButton
            color={dark ? 'white' : 'black'}
            onClick={() => setAuctionDropDialogOpen(true)}
          >
            {actualPrimaryButton.label}
          </StyledButton>
        ) : (
          <ContentLink url={actualPrimaryButton.url} onClick={track}>
            <StyledButton component="span" color={dark ? 'white' : 'black'}>
              {actualPrimaryButton.label}
            </StyledButton>
          </ContentLink>
        )}
        {secondaryButton ? (
          <HideMobile>
            <ContentLink url={secondaryButton.url} onClick={track}>
              <StyledButton component="span" color="transparent">
                {secondaryButton.label}
              </StyledButton>
            </ContentLink>
          </HideMobile>
        ) : null}
      </Row>
      {auctionDrop && (
        <AuctionDropModal
          open={auctionDropDialogOpen}
          onClose={() => setAuctionDropDialogOpen(false)}
          backgroundImage={backgroundImage}
          title={title}
          description={auctionDrop.modalText}
          event={{
            title,
            description,
            start: auctionDrop.start,
            end: auctionDrop.end,
            url: actualPrimaryButton.url,
          }}
        />
      )}
    </Root>
  );
};
