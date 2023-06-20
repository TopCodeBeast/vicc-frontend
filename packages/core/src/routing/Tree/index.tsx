import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import TagButton from '@sorare/core/src/atoms/buttons/TagButton';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from 'contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { theme } from '@sorare/core/src/style/theme';

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

const SideBar = styled.div`
  width: 100%;
  margin-right: 0;
  padding: 20px 30px;
  border-bottom: 1px solid var(--c-neutral-300);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    margin-right: 20px;
    width: 220px;
    padding: unset;
    border-bottom: unset;
  }
`;
const SectionTitle = styled(Text16)`
  color: var(--c-neutral-600);
`;
const Sub1 = styled.div`
  display: none;
  flex-direction: column;
  margin-left: 20px;
  align-items: baseline;
`;
const Section = styled.div`
  &.selected ${SectionTitle} {
    font-weight: bold;
    color: var(--c-brand-600);
  }
  &.selected ${Sub1} {
    display: flex;
  }
`;
const SectionButton = styled(ButtonBase)`
  margin-bottom: 5px;
`;

const Sub1Button = styled(ButtonBase)`
  margin-bottom: 5px;
`;
const Sub1Title = styled(Text16)`
  color: var(--c-neutral-600);
  &.selected {
    color: var(--c-brand-600);
  }
`;
const Dropdown = styled.div`
  margin-bottom: 40px;
`;
const Selected = styled(ButtonBase)`
  padding: 20px 30px;
  border-top: 1px solid var(--c-neutral-300);
  border-bottom: 1px solid var(--c-neutral-300);
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const SelectedSection = styled.span``;
const SelectedSub1 = styled.span``;
const Root = styled.div``;
const Title = styled.div`
  padding: 0px 20px;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding: unset;
  }
`;
const Container = styled.div`
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: flex;
  }
`;
const Right = styled.div`
  width: 100%;
`;
const Sub2 = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
`;
const Main = styled.div`
  padding-bottom: 10px;
`;

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
        <Section
          key={section}
          className={classnames({
            selected: selectedSection === section,
          })}
        >
          <SectionButton onClick={select(section)}>
            <SectionTitle>
              {translations ? formatMessage(translations[section]) : section}
            </SectionTitle>
          </SectionButton>
          {subSections && (
            <Sub1>
              {Object.keys(subSections).map(subSection => (
                <Sub1Button
                  onClick={select(section, subSection)}
                  key={`${section}/${subSection}`}
                  className={classnames({
                    selected: selectedSub1 === subSection,
                  })}
                >
                  <Sub1Title
                    className={classnames({
                      selected: selectedSub1 === subSection,
                    })}
                  >
                    {translations
                      ? formatMessage(translations[subSection])
                      : subSection}
                  </Sub1Title>
                </Sub1Button>
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
          <SelectedSection>{selectedSection}</SelectedSection>
          {selectedSub1 && (
            <SelectedSub1>&nbsp;/&nbsp;{selectedSub1}</SelectedSub1>
          )}
        </Text16>
        <FontAwesomeIcon icon={faChevronDown} />
      </Selected>
      {open && renderSideBar()}
    </Dropdown>
  );

  return (
    <Root>
      {!isLaptop && renderDropdown()}
      <Title>{title}</Title>
      <Container>
        {isLaptop && renderSideBar()}
        <Right>
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
          <Main>{children}</Main>
        </Right>
      </Container>
    </Root>
  );
};

export default Tree;
