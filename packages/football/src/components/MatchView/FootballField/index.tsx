import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useIntersection } from 'react-use';
import styled from 'styled-components';

import RadioButtons from '@sorare/core/src/atoms/buttons/RadioButtons';
import { hideScrollbar } from '@sorare/core/src/style/utils';

import Formation from '@football/components/MatchView/Formation';
import { SelectedTeam } from '@football/components/MatchView/types';

import FootballFieldLines from './FootballFieldLines';
import { FootballField_game } from './__generated__/index.graphql';

const Root = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  isolation: isolate;
  aspect-ratio: 0.6338;

  &.desktop {
    aspect-ratio: 1.5777;
    width: 100%;
  }
`;
const RadioButtonLabel = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;
const TeamImage = styled.img`
  height: 16px;
  border-radius: 2px;
`;
const TeamSelector = styled.div`
  position: absolute;
  z-index: 1;
  top: var(--half-unit);
  width: 100%;
  display: flex;
  justify-content: center;
  &.desktop {
    top: var(--unit);
  }
`;
const Field = styled.div`
  position: relative;
  isolation: isolate;
  background-color: #529661;
  border-radius: var(--double-unit);
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  color: var(--c-static-neutral-1000);
  aspect-ratio: 0.6338;
  height: 100%;

  &.desktop {
    aspect-ratio: 1.5777;
    scroll-snap-type: x mandatory;
    overflow-x: auto;
    width: 100%;
  }
  ${hideScrollbar};
`;
const FootballFieldWrapper = styled.div`
  height: 200%;
  &.desktop {
    height: initial;
    width: 200%;
  }
`;
const FormationsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 200%;
  &.desktop {
    flex-direction: row;
    gap: 0;
    height: initial;
    width: 200%;
  }
  & > * {
    flex: 1;
  }
`;

type Props = {
  game: FootballField_game;
  selectedTeam: SelectedTeam;
  setSelectedTeam: Dispatch<SetStateAction<SelectedTeam>>;
  onPlayerDetailsClick: (playerSlug: string) => void;
  desktop?: boolean;
};
const FootballField = ({
  game,
  selectedTeam,
  setSelectedTeam,
  onPlayerDetailsClick,
  desktop,
}: Props) => {
  const scroller = useRef<HTMLDivElement | null>(null);
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: scroller.current,
    rootMargin: '0px',
    threshold: 0.5,
  });

  useEffect(() => {
    setSelectedTeam(
      intersection?.isIntersecting ? SelectedTeam.AWAY : SelectedTeam.HOME
    );
  }, [intersection?.isIntersecting, setSelectedTeam]);

  const scrollTo = useCallback(
    (team: SelectedTeam) => {
      const scroll = scroller.current;
      if (!scroll) return;

      const isHomeSelected = team === SelectedTeam.HOME;
      const scrollAttr = desktop
        ? {
            left: isHomeSelected ? 0 : scroll.getBoundingClientRect().width,
          }
        : {
            top: isHomeSelected ? 0 : scroll.getBoundingClientRect().height,
          };
      scroll.scrollTo({
        ...scrollAttr,
        behavior: 'smooth',
      });
    },
    [desktop]
  );

  if (!(game.homeTeam && game.awayTeam)) {
    return null;
  }

  return (
    <Root className={classnames({ desktop })}>
      <TeamSelector>
        <RadioButtons
          handleChange={scrollTo}
          options={[
            {
              value: SelectedTeam.HOME,
              label: (
                <RadioButtonLabel>
                  {game.homeTeam.code}
                  <TeamImage src={game.homeTeam.pictureUrl || ''} />
                </RadioButtonLabel>
              ),
            },
            {
              value: SelectedTeam.AWAY,
              label: (
                <RadioButtonLabel>
                  <TeamImage src={game.awayTeam.pictureUrl || ''} />
                  {game.awayTeam.code}
                </RadioButtonLabel>
              ),
            },
          ]}
          value={selectedTeam}
          backgroundColor="var(--c-green-300)"
          activeBackgroundColor="var(--c-green-600)"
          color="var(--c-static-neutral-100)"
        />
      </TeamSelector>
      <Field className={classnames({ desktop })} ref={scroller}>
        <FootballFieldWrapper className={classnames({ desktop })}>
          <FootballFieldLines desktop={desktop} />
        </FootballFieldWrapper>
        <FormationsContainer className={classnames({ desktop })}>
          <Formation
            desktop={desktop}
            formation={game.homeFormation}
            onPlayerDetailsClick={onPlayerDetailsClick}
            gameDuration={0/*game.minute*/}
          />
          <Formation
            ref={intersectionRef}
            desktop={desktop}
            formation={game.awayFormation}
            onPlayerDetailsClick={onPlayerDetailsClick}
            gameDuration={0/*game.minute*/}
            reverse
          />
        </FormationsContainer>
      </Field>
    </Root>
  );
};

FootballField.fragments = {
  game: gql`
    fragment FootballField_game on Game {
      id
      awayTeam {
        ... on TeamInterface {
          slug
          code
          pictureUrl(derivative: "avatar")
        }
      }
      homeTeam {
        ... on TeamInterface {
          slug
          code
          pictureUrl(derivative: "avatar")
        }
      }
      ...Formation_game
    }
    ${Formation.fragments.game}
  ` as TypedDocumentNode<FootballField_game>,
};

export default FootballField;
