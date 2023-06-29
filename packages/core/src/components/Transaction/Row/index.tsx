import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';

type Props = {
  title?: string | ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  inline?: boolean;
};

const Root = styled.div`
  padding: 10px 0px;
  &.inline {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
  border-top: 1px solid var(--c-neutral-300);
`;
const Button = styled(Root)`
  cursor: pointer;
`;

export const Row = ({ title, children, onClick, inline = false }: Props) => {
  const renderRow = () => (
    <>
      {title && <Text16 as="div">{title}</Text16>}
      {children}
    </>
  );

  if (onClick) {
    return (
      <Button
        className={classnames({ inline })}
        onClick={onClick}
        onKeyDown={() => {}}
        role="button"
        tabIndex={0}
      >
        {renderRow()}
      </Button>
    );
  }

  return <Root className={classnames({ inline })}>{renderRow()}</Root>;
};

export default Row;
