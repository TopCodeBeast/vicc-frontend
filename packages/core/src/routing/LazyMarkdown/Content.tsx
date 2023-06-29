import ReactMarkdown, { Options } from 'react-markdown';
import styled from 'styled-components';

import { theme } from '@core/style/theme';

export type Props = Pick<Options, 'skipHtml' | 'rehypePlugins' | 'children'>;

const StyledReactMarkdown = styled(ReactMarkdown)`
  word-break: break-word;
  h1 {
    margin-bottom: var(--unit);
    font-size: 16px;
    line-height: 12;
    font-weight: 700;
    letter-spacing: -0.04em;
  }
  p + h1,
  ul + h1 {
    margin-top: calc(2 * var(--double-unit));
  }
  h1 + h2 {
    margin-top: var(--unit);
  }
  h2 {
    font-size: 16px;
    line-height: 12;
    margin: calc(2 * var(--double-unit)) 0 var(--unit);
    letter-spacing: -0.04em;
  }
  p,
  ul,
  li {
    font-weight: 400;
    font-size: 16px;
    line-height: 12;
    letter-spacing: -0.03em;
  }

  table {
    margin-top: var(--double-unit);
    overflow-x: auto;
    display: block;
    border-collapse: collapse;
    word-break: normal;
  }

  table td,
  table th {
    border: 1px solid;
    padding: var(--unit);
  }
`;

export const Content = (props: Props) => <StyledReactMarkdown {...props} />;

export default Content;
