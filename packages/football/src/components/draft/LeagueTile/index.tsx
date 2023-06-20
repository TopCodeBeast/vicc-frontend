import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CommonDraftCampaignStatus } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text16, Text20 } from '@sorare/core/src/atoms/typography';
import { fantasy } from '@sorare/core/src/lib/glossary';

import { LeagueTile_commonDraftCampaign } from './__generated__/index.graphql';

const Wrapper = styled.div`
  border-radius: var(--quadruple-unit);
  display: grid;
  grid-template-rows: 1fr max-content 1fr;
  gap: var(--double-unit);
  align-items: center;
  justify-content: center;
  position: relative;
  aspect-ratio: 0.8;
`;

const ContentWrapper = styled.div`
  grid-row-start: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;

const StyledButton = styled(Button)`
  grid-row-start: 3;
`;
const StyledImg = styled.img`
  width: 120px;
  height: 120px;
`;
const FlagWrapper = styled.div`
  display: flex;
  width: var(--double-unit);
`;
const FlagImg = styled.img`
  border-radius: var(--half-unit);
  width: 100%;
`;
const Disabled = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: var(--double-unit);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const LeagueTileContent = ({
  commonDraftCampaign,
}: {
  commonDraftCampaign: LeagueTile_commonDraftCampaign;
}) => {
  const competition = commonDraftCampaign.competitions[0];
  const { logoUrl, country } = competition;
  return (
    <>
      {logoUrl && (
        <StyledImg src={logoUrl} alt={commonDraftCampaign.displayName} />
      )}
      <TitleRow>
        {country && (
          <FlagWrapper>
            <FlagImg src={country.flagUrl} alt="" />
          </FlagWrapper>
        )}
        <Text20 bold>{commonDraftCampaign.displayName}</Text20>
      </TitleRow>
    </>
  );
};

type Props = {
  commonDraftCampaign: LeagueTile_commonDraftCampaign;
  to: string;
  onClick: () => void;
};

export const LeagueTile = ({ commonDraftCampaign, to, onClick }: Props) => {
  const competition = commonDraftCampaign.competitions[0];
  const { backgroundColor, backgroundPictureUrl } = competition;
  const isDisabled =
    commonDraftCampaign.status !== CommonDraftCampaignStatus.OPEN;
  return isDisabled ? (
    <Wrapper
      style={{
        background: `url(${
          backgroundPictureUrl || ''
        }) no-repeat top right/80%, ${
          backgroundColor || 'var(--c-neutral-100)'
        }`,
      }}
    >
      <Disabled>
        <Text16 bold color="var(--c-neutral-600)">
          <FormattedMessage {...fantasy.alreadyJoined} />
        </Text16>
      </Disabled>
      <LeagueTileContent commonDraftCampaign={commonDraftCampaign} />
      <Button color="blue" medium disabled>
        <FormattedMessage id="LeagueTile.cta" defaultMessage="Select" />
      </Button>
    </Wrapper>
  ) : (
    <Wrapper
      as={LinkBox}
      style={{
        background: `url(${
          backgroundPictureUrl || ''
        }) no-repeat top right/80%, ${
          backgroundColor || 'var(--c-neutral-100)'
        }`,
      }}
    >
      <ContentWrapper>
        <LeagueTileContent commonDraftCampaign={commonDraftCampaign} />
      </ContentWrapper>
      <LinkOverlay
        as={StyledButton}
        component={Link}
        to={to}
        onClick={onClick}
        color="blue"
        medium
        role="link"
        state={{
          sourcePage: 'pick-league',
        }}
      >
        <FormattedMessage id="LeagueTile.cta" defaultMessage="Select" />
      </LinkOverlay>
    </Wrapper>
  );
};

LeagueTile.fragments = {
  commonDraftCampaign: gql`
    fragment LeagueTile_commonDraftCampaign on CommonDraftCampaign {
      slug
      displayName
      status
      competitions {
        slug
        id
        backgroundColor
        backgroundPictureUrl
        logoUrl
        country {
          slug
          code
          flagUrl
        }
      }
    }
  `,
};
