import ReactMarkdown, { Options } from 'react-markdown';
import styled from 'styled-components';

import { theme } from '@core/style/theme';

export type Props = Pick<Options, 'skipHtml' | 'rehypePlugins' | 'children'>;

const StyledReactMarkdown = styled(ReactMarkdown)`
  word-break: break-word;
  h1 {
    margin-bottom: var(--unit);
    font-size: ${theme.fontSize.bigger}px;
    line-height: ${theme.lineHeight.bigger};
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
    font-size: ${theme.fontSize.big}px;
    line-height: ${theme.lineHeight.big};
    margin: calc(2 * var(--double-unit)) 0 var(--unit);
    letter-spacing: -0.04em;
  }
  p,
  ul,
  li {
    font-weight: 400;
    font-size: ${theme.fontSize.medium}px;
    line-height: ${theme.lineHeight.normal};
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
