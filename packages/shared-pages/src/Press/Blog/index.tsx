import { useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import Gap from '@sorare/core/src/components/marketing/Gap';
import {
  DrukWide64,
  MarketingText20,
} from '@sorare/core/src/components/marketing/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-and-a-half-unit);
`;

const Desc = styled(MarketingText20)`
  @media ${tabletAndAbove} {
    max-width: 50%;
  }
`;

const Row = styled.div`
  display: flex;
  gap: calc(5 * var(--unit));
  flex-direction: column;
  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;

const Post = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--intermediate-unit);
  width: 100%;
  @media ${tabletAndAbove} {
    gap: var(--double-and-a-half-unit);
  }
`;

const ThumbnailContainer = styled.div`
  overflow: hidden;
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
`;

const Thumbnail = styled.img`
  object-fit: cover;
  aspect-ratio: 2/1;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  object-position: center;
  :hover {
    transform: scale(1.02);
  }
`;

const mediumURL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sorare';

type Post = {
  title: string;
  thumbnail: string;
  pubDate: string;
  categories: string[];
  guid: string;
};

export const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  if (posts.length === 0) {
    fetch(mediumURL)
      .then(async res => res.json())
      .then(data => {
        setPosts(
          data.items.filter((item: Post) => item?.categories.length > 0)
        );
      });
  }

  return (
    <>
      <Titles>
        <DrukWide64>
          <FormattedMessage
            id="press.blog.title"
            defaultMessage="Latest News"
          />
        </DrukWide64>
        <Desc>
          <FormattedMessage
            id="press.blog.desc"
            defaultMessage="Our thought leadership in the press and latest thinking on vision, strategy, culture, and brand."
          />
        </Desc>
      </Titles>
      <Gap size="xs" />
      <Row>
        {posts.slice(0, 3).map(post => (
          <Post key={post.title} href={post.guid} target="_blank">
            <ThumbnailContainer>
              <Thumbnail src={post.thumbnail} alt={post.title} />
            </ThumbnailContainer>
            <MarketingText20>{post.title}</MarketingText20>
            <Text14 uppercase color="var(--c-static-neutral-600)">
              <FormattedDate
                value={post.pubDate}
                month="short"
                day="numeric"
                year="numeric"
              />
            </Text14>
          </Post>
        ))}
      </Row>
    </>
  );
};
