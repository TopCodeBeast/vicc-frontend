import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { FC, ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import TagButton from '@core/atoms/buttons/TagButton';
import { Text16 } from '@core/atoms/typography';
import { useIntlContext } from '@core/contexts/intl';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useToggle from '@core/hooks/useToggle';
import { laptopAndAbove } from '@core/style/mediaQuery';

export type Selection = [string, string | undefined, string | undefined];
type SubSection = Record<string, undefined | string[]>;
type TreeSchema = Record<string, undefined | SubSection>;

interface Props {
  schema: TreeSchema;
  selected: Selection;
  onSelect: (selected: Selection) => void;
  title: ReactElement;
  children: ReactElement;
  translations?: Record<string, MessageDescriptor>;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  margin-top: var(--double-unit);
`;
const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  border-bottom: 1px solid var(--c-neutral-300);
  padding-bottom: var(--double-unit);
  button {
    text-align: left;
  }
  @media ${laptopAndAbove} {
    min-width: 220px;
    border-bottom: none;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;
const Sub1 = styled.div`
  display: none;
  flex-direction: column;
  gap: var(--unit);
  margin-left: var(--double-unit);
  justify-content: stretch;
  &.selected {
    display: flex;
  }
`;
const Selected = styled.button`
  display: flex;
  justify-content: space-between;
  color: var(--c-neutral-1000);
`;
const Container = styled.div`
  @media ${laptopAndAbove} {
    display: flex;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  width: 100%;
`;
const Sub2 = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: auto;
  gap: var(--unit);
`;

const Button: FC<{ onClick: () => void; selected: boolean }> = ({
  onClick,
  selected,
  children,
}) => (
  <Text16
    color={selected ? 'var(--c-brand-600)' : 'var(--c-neutral-600)'}
    as="button"
    onClick={onClick}
    type="button"
    bold={selected}
  >
    {children}
  </Text16>
);

export const Tree = ({
  schema,
  selected,
  onSelect,
  title,
  translations,
  children,
}: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');
  const [open, toggleOpen] = useToggle(false);
  const { formatMessage } = useIntlContext();
  const [selectedSection, selectedSub1, selectedSub2] = selected;

  const selectSub1 = (section: string, sub1?: string) => {
    if (!schema[section]) return undefined;

    return sub1 || selectedSub1 || Object.keys(schema[section]!)[0];
  };

  const selectSub2 = (section: string, sub1?: string, sub2?: string) => {
    const s1 = selectSub1(section, sub1);
    if (!s1) return undefined;
    if (!schema[section]![s1]) return undefined;

    return sub2 || selectedSub2 || schema[section]![s1]?.[0];
  };

  const select = (section: string, sub1?: string, sub2?: string) => () => {
    const s1 = selectSub1(section, sub1);
    const s2 = selectSub2(section, sub1, sub2);
    onSelect([section, s1, s2]);
    if (!sub2) toggleOpen();
  };

  const sub2 = () => {
    const sub1 = schema[selectedSection];
    if (!sub1) return undefined;
    if (!selectedSub1) return undefined;

    return sub1[selectedSub1];
  };

  const renderSideBar = () => (
    <SideBar>
      {Object.entries(schema).map(([section, subSections]) => (
        <Section key={section}>
          <Button
            selected={selectedSection === section}
            onClick={select(section)}
          >
            {translations ? formatMessage(translations[section]) : section}
          </Button>
          {subSections && (
            <Sub1
              className={classnames({
                selected: selectedSection === section,
              })}
            >
              {Object.keys(subSections).map(subSection => (
                <Button
                  key={`${section}/${subSection}`}
                  selected={selectedSub1 === subSection}
                  onClick={select(section, subSection)}
                >
                  {translations
                    ? formatMessage(translations[subSection])
                    : subSection}
                </Button>
              ))}
            </Sub1>
          )}
        </Section>
      ))}
    </SideBar>
  );

  const renderDropdown = () => (
    <Dropdown>
      <Selected onClick={toggleOpen}>
        <Text16 bold>
          {selectedSection}
          {selectedSub1 && <>&nbsp;/&nbsp;{selectedSub1}</>}
        </Text16>
        <FontAwesomeIcon icon={faChevronDown} />
      </Selected>
      {open && renderSideBar()}
    </Dropdown>
  );

  return (
    <Root>
      {!isLaptop && renderDropdown()}
      <div>{title}</div>
      <Container>
        {isLaptop && renderSideBar()}
        <Content>
          {sub2() && (
            <Sub2>
              {sub2()?.map(sub2Title => (
                <TagButton
                  key={sub2Title}
                  onClick={select(selectedSection, selectedSub1, sub2Title)}
                  selected={sub2Title === selectedSub2}
                >
                  {sub2Title}
                </TagButton>
              ))}
            </Sub2>
          )}
          <div>{children}</div>
        </Content>
      </Container>
    </Root>
  );
};

export default Tree;
