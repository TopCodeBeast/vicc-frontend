import { gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Container from '@sorare/core/src/atoms/layout/Container';
import LinkWithTransition from '@sorare/core/src/atoms/navigation/LinkWithTransition';
import { Title1, Title3 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_CLUB_SHOW,
  FOOTBALL_LEAGUE_SHOW,
} from '@sorare/core/src/constants/routes';
import { theme } from '@sorare/core/src/style/theme';
import { createVar } from '@sorare/core/src/style/utils';

import placeholder from 'assets/players/placeholder.png';
import Follower from '@sorare/football/src/components/favorites/Follower';
import { InnerContainer, Root } from '@sorare/football/src/components/layout/header/ui';
import Information from '@sorare/football/src/pages/Player/Information';

import { Header_player } from './__generated__/index.graphql';

const backgroundImgVar = createVar();

const HeaderContainer = styled.div`
  position: relative;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-left: 260px;
  }
  &::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    background: var(${backgroundImgVar}) no-repeat center var(--unit);
    background-size: auto 60%;
    mask-image: linear-gradient(to top, transparent 40%, black 60%);
    content: '';
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      mask-image: linear-gradient(to top, transparent 0%, black 50%);
      background-size: auto 100%;
      background-position: left bottom;
    }
  }
`;
const InformationRoot = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  text-align: center;
  padding: 0;
  height: 350px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    height: 230px;
    text-align: left;
    justify-content: flex-start;
    align-items: center;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const LeftContent = styled.div`
  color: var(--c-static-neutral-100);
  display: flex;
  flex-direction: column;
  padding-bottom: var(--triple-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-bottom: 0;
  }
`;
const NamePositionClub = styled.div`
  padding-bottom: 10px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-bottom: 20px;
  }
`;
const ClubSeparator = styled(Title3)`
  opacity: 0.6;
`;
const Cta = styled.div`
  margin-top: 10px;
  justify-content: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    margin-top: 20px;
    justify-content: flex-start;
  }
`;

export interface Props {
  player: Header_player;
}

const Header = (props: Props) => {
  const { player } = props;
  const { displayName, activeClub } = player;

  return (
    <Root>
      <Container>
        <InnerContainer>
          <HeaderContainer
            style={{
              [backgroundImgVar]: `url('${
                player.squaredPictureUrl ?? placeholder
              }')`,
            }}
          >
            <InformationRoot>
              <Content>
                <LeftContent>
                  <NamePositionClub>
                    <Title1>{displayName}</Title1>
                    {activeClub && (
                      <div>
                        {activeClub?.domesticLeague && (
                          <>
                            <LinkWithTransition
                              to={generatePath(FOOTBALL_LEAGUE_SHOW, {
                                slug: activeClub.domesticLeague.slug,
                              })}
                            >
                              <Title3 as="span">
                                {activeClub.domesticLeague.displayName}
                              </Title3>
                            </LinkWithTransition>
                            <ClubSeparator as="span">
                              &nbsp;•&nbsp;
                            </ClubSeparator>
                          </>
                        )}
                        <LinkWithTransition
                          to={generatePath(FOOTBALL_CLUB_SHOW, {
                            slug: activeClub.slug,
                          })}
                        >
                          <Title3 as="span">{activeClub.name}</Title3>
                        </LinkWithTransition>
                      </div>
                    )}
                  </NamePositionClub>
                  <Information player={player} />
                  <Cta>
                    <Follower />
                  </Cta>
                </LeftContent>
              </Content>
            </InformationRoot>
          </HeaderContainer>
        </InnerContainer>
      </Container>
    </Root>
  );
};

Header.fragments = {
  player: gql`
    fragment Header_player on Player {
      slug
      displayName
      squaredPictureUrl: pictureUrl(derivative: "squared")
      activeClub {
        slug
        name
        domesticLeague {
          slug
          displayName
        }
      }
      ...Information_player
    }
    ${Information.fragments.player}
  `,
};

export default Header;
