import { FormattedMessage } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import ColouredContainer from '@sorare/core/src/components/marketing/ColouredContainer';
import Gap from '@sorare/core/src/components/marketing/Gap';
import ImageBlock from '@sorare/core/src/components/marketing/ImageBlock';
import MarketingPage from '@sorare/core/src/components/marketing/MarketingPage';
import Section from '@sorare/core/src/components/marketing/Section';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { metadatas } from '@sorare/core/src/lib/seo/common';

import { Blog } from './Blog';
import { Figures } from './Figures';
import { HowToPlay } from './HowToPlay';
import { InTheNews } from './InTheNews';
import { TeamMembers } from './TeamMembers';

const press = `${FRONTEND_ASSET_HOST}/pages/press/press.jpg`;
const aboutUs = `${FRONTEND_ASSET_HOST}/pages/press/aboutUs.jpg`;

const Press = () => {
  useTitleAndDescription(metadatas.press.title);

  return (
    <MarketingPage>
      <Container>
        <Gap size="lg" />
        <Section
          title={
            <FormattedMessage id="Press.press.title" defaultMessage="Press" />
          }
          extract={
            <FormattedMessage
              id="Press.press.desc"
              defaultMessage="Find the Sorare latest press releases and related material such as press kit, company information and images library. Reach out to {email} for any media inquiries"
              values={{
                email: <a href="mailto:press@sorare.com">press@sorare.com</a>,
              }}
            />
          }
          button={
            <Button
              externalLink
              href="https://sorare-pub.notion.site/sorare-pub/40fa2c234df7404eb8b9769221a317aa?v=d1afcbb9a3c04112af9723d7fff8aaf8"
              color="black"
              medium
            >
              <FormattedMessage
                id="Press.press.cta"
                defaultMessage="Download Press kit"
              />
            </Button>
          }
        />
        <Gap size="xs" />
        <ImageBlock src={press} alt={press} cover />
        <Gap size="xl" />
        <Section
          topBorder
          title={
            <FormattedMessage
              id="Press.aboutUs.title"
              defaultMessage="About us"
            />
          }
          titleTag={
            <FormattedMessage
              id="Press.aboutUs.titleTag"
              defaultMessage="The company"
            />
          }
          chapo={
            <FormattedMessage
              id="Press.aboutUs.desc"
              defaultMessage="Sorare was founded by <bold>Nicolas Julia</bold> and <bold>Adrien Montfort</bold> in 2018 in Paris to bring sports fans across the globe closer to the players, teams, and leagues they love. "
              values={{
                bold: Bold,
              }}
            />
          }
          paragraph={
            <FormattedMessage
              id="Press.aboutUs.paragraph.1"
              defaultMessage="Sorare is a fantasy sports gaming experience and marketplace featuring officially licensed digital player cards. With Sorare you build legacy teams buying, selling, collecting and trading player cards and compete with them in free-to-play fantasy games to win rewards week over week and season over season, just like a professional sports owner. {br}
            Sorare is revolutionising digital sports fandom, and now has over 3 million users across 180 countries. More than 300 iconic teams, clubs, and organisations including the <bold>Premier League, La Liga, Bundesliga, Serie A, MLS, NBA, NBPA, MLB, MLBPA</bold>, and many others have partnered with Sorare to build the next sports entertainment giant."
              values={{
                bold: Bold,
                br: <br />,
              }}
            />
          }
        />
        <Gap size="sm" />
        <ImageBlock
          legendTitle="160"
          legendDesc={
            <FormattedMessage
              id="Press.aboutUs.imageDesc"
              defaultMessage="160-plus employees across <bold>France and New York</bold>"
              values={{
                bold: Bold,
              }}
            />
          }
          src={aboutUs}
          alt={aboutUs}
        />
        <Gap size="sm" />
        <Section
          paragraph={
            <FormattedMessage
              id="Press.aboutUs.paragraph.2"
              defaultMessage="One of Europe’s fastest-growing startups and recently raised a $680 million Series B funding round at a $4.3 billion valuation from world-class investors including SoftBank, Accel, and Benchmark. Sorare also has athletes <bold>Serena Williams, Lionel Messi, Zinedine Zidane, Rio Ferdinand, Antoine Griezmann, Gerard Piqué, Blake Griffin, and Rudy Gobert</bold> among its investors, ambassadors, and advisors."
              values={{
                bold: Bold,
                br: <br />,
              }}
            />
          }
        />
        <Gap size="xl" />
      </Container>
      <ColouredContainer color="var(--c-static-neutral-1000)">
        <Figures />
        <Gap size="lg" />
        <InTheNews />
        <Gap size="md" />
      </ColouredContainer>
      <HowToPlay />
      <Container>
        <Gap size="xl" />
        <Section
          topBorder
          title={
            <FormattedMessage
              id="Press.team.title"
              defaultMessage="Meet our{br}
              leadership{br}
              team"
              values={{ br: <br /> }}
            />
          }
          chapo={
            <FormattedMessage
              id="Press.team.chapo"
              defaultMessage="We believe in the <bold>power of collaboration</bold> to <bold>overcome challenges</bold>."
              values={{
                bold: Bold,
              }}
            />
          }
        />
        <Gap size="md" />
        <TeamMembers />
        <Gap size="xl" />
      </Container>
      <ColouredContainer color="var(--c-static-neutral-200)">
        <Gap size="xl" />
        <Blog />
        <Gap size="xl" />
      </ColouredContainer>
    </MarketingPage>
  );
};

export default Press;
