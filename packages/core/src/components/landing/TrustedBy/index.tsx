import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components';

import { Text18 } from '@sorare/core/src/atoms/typography';
import { theme } from '@sorare/core/src/style/theme';

import football1x from './assets/football-1x.png';
import football2x from './assets/football-2x.png';
import mbappe1x from './assets/mbappe-1x.png';
import mbappe2x from './assets/mbappe-2x.png';
import messi1x from './assets/messi-1x.png';
import messi2x from './assets/messi-2x.png';
import mlb1x from './assets/mlb-1x.png';
import mlb2x from './assets/mlb-2x.png';
import nba1x from './assets/nba-1x.png';
import nba2x from './assets/nba-2x.png';
import pique1x from './assets/pique-1x.png';
import pique2x from './assets/pique-2x.png';
import pl1x from './assets/pl-1x.png';
import pl2x from './assets/pl-2x.png';
import serena1x from './assets/serena-1x.png';
import serena2x from './assets/serena-2x.png';

const Wrapper = styled.section`
  padding: 0 var(--unit) calc(5 * var(--unit));
  padding-bottom: calc(5 * var(--unit));
  align-items: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Title = styled.h3`
  ${theme.styledFonts.drukWideSuper}
  font-size: 30px;
  line-height: 100%;
  margin: calc(5 * var(--unit)) 0 var(--double-unit);
  word-break: break-word;
  text-transform: uppercase;
`;

const SubHeading = styled(Text18)`
  color: var(--c-static-neutral-600);
  margin-bottom: var(--double-unit);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
`;

const GridList = styled.ul`
  display: grid;
  gap: var(--double-unit);
  grid-template-areas: 'a b' 'd c' 'e f' 'h g';
  margin: 0;
  padding: 0;
  & *:nth-child(1) {
    grid-area: a;
  }
  & *:nth-child(2) {
    grid-area: b;
  }
  & *:nth-child(3) {
    grid-area: c;
  }
  & *:nth-child(4) {
    grid-area: d;
  }
  & *:nth-child(5) {
    grid-area: e;
  }
  & *:nth-child(6) {
    grid-area: f;
  }
  & *:nth-child(7) {
    grid-area: g;
  }
  & *:nth-child(8) {
    grid-area: h;
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-areas: none;
    grid-template-columns: repeat(8, 1fr);
    * {
      grid-area: unset !important;
    }
  }
`;
const PictureLink = styled.a`
  width: 100%;
  &:focus {
    filter: drop-shadow(0 var(--half-unit) var(--unit) rgba(0, 0, 0, 0.5));
  }
`;

const partners = [
  {
    name: 'Kylian Mbappe (Investor)',
    link: 'https://insidersport.com/2022/06/30/kylian-mbappe-enters-web3-space-as-sorare-ambassador/',
    srcSets: [mbappe1x, mbappe2x],
  },
  {
    name: 'NBA',
    link: 'https://www.forbes.com/sites/timcasey/2022/09/07/nba-nba-players-association-strike-deal-with-sorare-for-nft-fantasy-game',
    srcSets: [nba1x, nba2x],
  },
  {
    name: 'Messi',
    link: 'https://www.cnbc.com/2022/11/09/lionel-messi-takes-stake-in-nft-fantasy-soccer-game-sorare.html#:~:text=Paris%20Saint%2DGermain%20forward%20Lionel,five%20in%20fantasy%20soccer%20tournaments',
    srcSets: [messi1x, messi2x],
  },
  {
    name: 'Premier League',
    link: 'https://techcrunch.com/2023/01/30/sorare-teams-up-with-the-premier-league-for-its-nft-fantasy-football-game/',
    srcSets: [pl1x, pl2x],
  },
  {
    name: 'Serena Williams (Strategic Advisor)',
    link: 'https://fortune.com/2022/01/20/serena-williams-joins-sorare-board/',
    srcSets: [serena1x, serena2x],
  },
  {
    name: 'MLB',
    link: 'https://www.nytimes.com/2022/05/12/sports/mlb-sorare-nft.html',
    srcSets: [mlb1x, mlb2x],
  },
  {
    name: 'Gérard Piqué (Strategic Advisor)',
    link: 'https://www.forbes.com/sites/henryflynn/2020/12/18/gerard-pique-joins-sorare-to-help-reinvent-fantasy-soccer-worldwide',
    srcSets: [pique1x, pique2x],
  },
  {
    name: 'Football',
    link: '',
    srcSets: [football1x, football2x],
  },
];

const Picture = ({ alt, srcSets }: { alt: string; srcSets: string[] }) => {
  const [src1x, src2x] = srcSets;
  return (
    <picture>
      <source srcSet={`${src2x} 2x`} />
      <source srcSet={`${src1x} 1x`} />
      <Image loading="lazy" src={src1x} alt={alt} />
    </picture>
  );
};

export const TrustedBy = () => {
  const [load, setLoad] = useState(false);
  return (
    <Wrapper>
      <Waypoint onEnter={() => setLoad(true)} bottomOffset="-500px" />
      <Title>
        <FormattedMessage
          id="TrustedBy.title"
          defaultMessage="Sorare partners"
        />
      </Title>
      <SubHeading>
        <FormattedMessage
          id="TrustedBy.subhead"
          defaultMessage="Dozens of high-profile athletes and investors have joined forces with Sorare as brand ambassadors, advocates, and/or investors."
        />
      </SubHeading>
      {load && (
        <GridList>
          {partners.map(partner => (
            <PictureLink key={partner.name} href={partner.link} target="_blank">
              <Picture alt={partner.name} srcSets={partner.srcSets} />
            </PictureLink>
          ))}
        </GridList>
      )}
    </Wrapper>
  );
};
