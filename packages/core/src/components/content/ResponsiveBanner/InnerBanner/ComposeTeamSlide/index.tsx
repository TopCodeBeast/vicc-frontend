import { faArrowAltRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import addUser from '@core/assets/user/add-user.svg';
import { Text14 } from '@core/atoms/typography';
import ContentLink from '@core/components/content/ContentLink';

import { SlideProps } from '../../types';
import { AuctionDropText } from '../AuctionDropText';

const StyledTitle = styled(Text14)`
  font-weight: var(--t-bolder);
`;
const Root = styled.div<{
  $dark?: boolean;
}>`
  scroll-snap-align: center;
  width: 100%;
  flex-shrink: 0;

  color: ${({ $dark }) => ($dark ? 'white' : 'inherit')};
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  border: 1px solid var(--c-neutral-300);
  cursor: pointer;
  box-shadow: 0px 1px 6px rgb(0 0 0 / 10%);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-200);
`;
const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
  padding: var(--unit);
`;
const CardPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 80px;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    var(--c-static-neutral-800);
  border-radius: 5px;
`;
const LinkText = styled(Text14)`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = SlideProps & {
  track: () => void;
};

export const ComposeTeamSlide = ({
  track,
  title,
  dark,
  primaryButton,
  auctionDrop,
}: Props) => {
  const actualPrimaryButton = auctionDrop!.livePrimaryButton || primaryButton;

  return (
    <Root $dark={Boolean(dark)}>
      <ContentLink url={actualPrimaryButton.url} onClick={track}>
        <InnerContainer>
          <CardPlaceholder>
            <img src={addUser} alt="Add Player" />
          </CardPlaceholder>
          <div>
            {auctionDrop && <AuctionDropText live date={auctionDrop.end} />}
            <StyledTitle>{title}</StyledTitle>
            <LinkText>
              {actualPrimaryButton.label}
              <FontAwesomeIcon icon={faArrowAltRight} />
            </LinkText>
          </div>
        </InnerContainer>
      </ContentLink>
    </Root>
  );
};
