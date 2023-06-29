import { faWarning } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { isAbsolute } from '@sorare/core/src/lib/urls';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
  &,
  &:hover,
  &:focus {
    color: inherit;
  }
  @media ${tabletAndAbove} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;
const MessageWrapper = styled.div`
  display: flex;
  gap: var(--double-unit);
`;

type Props = {
  message: ReactElement;
  url?: string;
  button?: ReactElement;
};
const GreyRow = ({ url, message, button }: Props) => {
  const Content = (
    <>
      <MessageWrapper>
        <FontAwesomeIcon
          icon={faWarning}
          color="var(--c-yellow-600)"
          size="lg"
        />
        <span>{message}</span>
      </MessageWrapper>
      {button && <div>{button}</div>}
    </>
  );

  if (!url) {
    return <Root>{Content}</Root>;
  }
  if (isAbsolute(url)) {
    return (
      <Root as="a" href={url} target="_blank" rel="noreferrer">
        {Content}
      </Root>
    );
  }
  return (
    <Root as={Link} to={url}>
      {Content}
    </Root>
  );
};

export default GreyRow;
