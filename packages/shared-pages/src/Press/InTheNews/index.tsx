import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Gap from '@sorare/core/src/components/marketing/Gap';
import { DrukWide24 } from '@sorare/core/src/components/marketing/typography';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { articles } from './data';

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: space-around;
  align-items: center;
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
  @media ${laptopAndAbove} {
    display: flex;
  }
`;

const Link = styled.a`
  display: flex;
  align-self: center;
  justify-self: center;
`;

const Img = styled.img`
  max-width: 160px;
  width: 100%;
  align-self: center;
  justify-self: center;
`;

export const InTheNews = () => {
  return (
    <>
      <DrukWide24 color="var(--c-pink-600)">
        <FormattedMessage id="inTheNews.title" defaultMessage="In the news" />
      </DrukWide24>
      <Gap size="xs" />
      <Row>
        {articles.map(article => (
          <Link key={article.name} href={article.href} target="_blank">
            <Img src={article.svgUrl} alt={article.name} />
          </Link>
        ))}
      </Row>
    </>
  );
};
