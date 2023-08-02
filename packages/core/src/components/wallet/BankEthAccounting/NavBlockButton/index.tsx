import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import ButtonBase from '@core/atoms/buttons/ButtonBase';
import { ChevronRightBold } from '@core/atoms/icons/ChevronRightBold';
import { Text14, Text16 } from '@core/atoms/typography';

const BaseBlockButton = styled.div`
  width: 100%;
  display: flex;
  padding: var(--double-unit) 0;
  height: auto;
  min-width: 338px;
  align-self: center;
  justify-content: flex-start;
  border-bottom: 1px solid var(--c-neutral-300);
`;

const BlockButton = styled(ButtonBase)`
  width: 100%;
  display: flex;
  padding: var(--double-unit) 0;
  height: auto;
  min-width: 338px;
  align-self: center;
  justify-content: flex-start;
  border-bottom: 1px solid var(--c-neutral-300);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
  width: 100%;
`;

const ButtonContent = styled.div`
  display: flex;
  width: 100%;
  gap: var(--double-unit);
  align-items: flex-start;
  text-align: left;
  white-space: break-spaces;
  .disabled & {
    opacity: 0.5;
  }
`;

const BaseIcon = styled.div`
  border-radius: 50%;
  width: var(--triple-unit);
  height: var(--triple-unit);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-neutral-1000);
  align-self: center;
`;

const BlockText = styled.div<{ withoutDescription?: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: max-content;
  gap: var(--half-unit);
  ${({ withoutDescription }) => withoutDescription && 'align-self: center;'}
`;

type Props = {
  onClick: () => void;
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  helper?: ReactNode;
  disabled?: boolean;
  withArrow?: boolean;
};

export const NavBlockButton = ({
  title,
  description,
  helper,
  onClick,
  icon,
  disabled = false,
}: Props) => {
  const content = (
    <Column>
      <ButtonContent>
        <BaseIcon>{icon}</BaseIcon>
        <BlockText withoutDescription={!description}>
          <Text16>{title}</Text16>
          {description && (
            <Text14 color="var(--c-color-600)">{description}</Text14>
          )}
        </BlockText>
        <BaseIcon>
          <ChevronRightBold />
        </BaseIcon>
      </ButtonContent>
      {helper}
    </Column>
  );
  if (disabled) {
    return (
      <BaseBlockButton className={classNames({ disabled })}>
        {content}
      </BaseBlockButton>
    );
  }
  return (
    <BlockButton color="gray" onClick={onClick}>
      {content}
    </BlockButton>
  );
};
