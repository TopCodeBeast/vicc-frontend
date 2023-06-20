import { useMemo } from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

import Body from '@sorare/core/src/atoms/layout/Body';
import Container from '@sorare/core/src/atoms/layout/Container';
import useFetch from '@sorare/core/src/hooks/useFetch';
import { fileUrl } from '@sorare/core/src/lib/gitlab';
import LazyMarkdown from 'routing/LazyMarkdown';

interface Props {
  document: string;
  skipHtml?: boolean;
  escapeHtml?: boolean;
}

const StyledBody = styled(Body)`
  overflow: auto;
`;
const Root = styled.div`
  & li {
    list-style-type: square;
  }
  & li:not(:last-child) {
    margin-bottom: 10px;
  }
  & blockquote {
    margin-left: 0;
    margin-right: 0;
    padding: 10px;
    border-left: 3px solid grey;
    background-color: rgba(var(--c-rgb-brand-600), 0.25);
    & p {
      margin: 0;
    }
    & p:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  & * {
    white-space: normal;
  }
`;

const TextDocument = ({ document, skipHtml, escapeHtml = true }: Props) => {
  const data = useFetch(fileUrl(document));
  const rehypePlugins = useMemo(() => {
    return [
      remarkGfm,
      // If we accept html in input, we need rehypeRaw
      escapeHtml ? null : rehypeRaw,
    ].filter(Boolean);
  }, [escapeHtml]);
  return (
    <StyledBody>
      <Container>
        <Root>
          <LazyMarkdown
            data={data}
            skipHtml={skipHtml}
            rehypePlugins={rehypePlugins}
          />
        </Root>
      </Container>
    </StyledBody>
  );
};

export default TextDocument;
