import ReactMarkdown, { Options } from 'react-markdown';
import styled from 'styled-components';

export type Props = Pick<Options, 'skipHtml' | 'rehypePlugins' | 'children'>;

const StyledReactMarkdown = styled(ReactMarkdown)`
  word-break: break-word;
  h1 {
    margin-bottom: var(--unit);
    font: var(--t-bold) var(--t-24);
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
    font: var(--t-bold) var(--t-20);
    margin: calc(2 * var(--double-unit)) 0 var(--unit);
    letter-spacing: -0.04em;
  }
  h3 {
    font: var(--t-14);
    margin-top: var(--unit);
    letter-spacing: -0.04em;
  }
  p,
  ul,
  li {
    font: var(--t-14);
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
