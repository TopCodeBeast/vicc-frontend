import classnames from 'classnames';
import { ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title4 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

const SingleDescription = ({
  description,
}: {
  description: MessageDescriptor;
}) => (
  <Text16 color="var(--c-neutral-600)">
    <FormattedMessage {...description} />
  </Text16>
);

type Description = MessageDescriptor | MessageDescriptor[];

const DescriptionDisplayer = ({
  description,
}: {
  description: Description;
}) => {
  if (Array.isArray(description)) {
    return (
      <>
        {description.map(d => {
          return <SingleDescription key={d.id} description={d} />;
        })}
      </>
    );
  }
  return <SingleDescription description={description} />;
};

type Props = {
  title?: MessageDescriptor;
  description?: Description;
  isEnabled?: boolean;
  noBorder?: boolean;
  toggleButton?: ReactNode;
  children?: ReactNode;
};
const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid var(--c-neutral-400);
  border-radius: var(--double-unit);
  width: 100%;
  padding: var(--double-unit);
  gap: var(--double-unit);
  &.noBorder {
    border-top: none;
  }
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--unit);
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--unit);
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
const Badge = styled.div`
  font-size: 14px;
  font-family: apercu-pro, system-ui, sans-serif;
  font-weight: 900;
  font-style: normal;
  line-height: 28px;
  border-radius: 2em;
  color: var(--c-neutral-400);
  background-color: var(--c-neutral-300);
  padding: 0 var(--double-unit);
  &.isEnabled {
    color: var(--c-green-600);
    background-color: rgba(var(--c-rgb-green-600), 0.25);
  }
`;
const ToggleButton = styled.div``;
const SettingsSection = ({
  title,
  description,
  noBorder,
  isEnabled,
  children,
  toggleButton,
}: Props) => {
  return (
    <Root className={classnames({ noBorder })}>
      {(description || title || isEnabled !== undefined) && (
        <Header>
          <Container>
            {(title || isEnabled !== undefined) && (
              <Title>
                <Title4>
                  <FormattedMessage {...title} />
                </Title4>
                {isEnabled !== undefined && (
                  <div>
                    <Badge className={classnames({ isEnabled })}>
                      {isEnabled ? (
                        <FormattedMessage {...glossary.enabled} />
                      ) : (
                        <FormattedMessage {...glossary.disabled} />
                      )}
                    </Badge>
                  </div>
                )}
              </Title>
            )}
            {description && <DescriptionDisplayer description={description} />}
          </Container>
          {toggleButton && <ToggleButton>{toggleButton}</ToggleButton>}
        </Header>
      )}
      {children}
    </Root>
  );
};

export default SettingsSection;
