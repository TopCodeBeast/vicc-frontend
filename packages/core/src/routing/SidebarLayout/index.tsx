import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode, useMemo } from 'react';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Container } from '@core/atoms/container';
import Dialog from '@core/atoms/layout/Dialog';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useToggle from '@core/hooks/useToggle';
import { tabletAndAbove } from '@core/style/mediaQuery';

import SidebarLink, { LinkProps } from './SidebarLink';

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

export interface Link<ID extends string = string> extends LinkProps<ID> {
  id: ID;
}

export interface Props<ID extends string = string> {
  activeLink: ID;
  links: Link<ID>[];
  children: ReactNode;
  onClick?: (id: ID) => void;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--unit) 0;
  @media ${tabletAndAbove} {
    padding: var(--triple-unit) 0;
    flex-direction: row;
    gap: var(--quadruple-unit);
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  border-radius: 8px;
  overflow: hidden;
  min-width: max-content;
`;
const MobileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: var(--c-neutral-100);
`;
const MobileExpand = styled(IconButton)`
  &:hover {
    background-color: inherit;
  }
`;
const Content = styled.div`
  width: 100%;
`;

const StyledContainer = styled(Container)`
  flex: 1;
`;

export const SidebarLayout = <ID extends string = string>({
  activeLink,
  links,
  children,
  onClick,
}: Props<ID>) => {
  const [menuOpened, toggleMenuOpened] = useToggle(false);
  const { up: isGreaterThanTablet } = useScreenSize('tablet');

  const nestedLinks = useMemo(() => {
    return links
      .map(({ nested }) => nested)
      .filter(Boolean)
      .flat()
      .map(link => ({
        ...link,
        icon: links.find(({ id }) => id === link?.parent)?.icon,
      }));
  }, [links]);

  const nestedLink = useMemo(() => {
    return nestedLinks.find(link => link.id === activeLink);
  }, [activeLink, nestedLinks]);

  const mobileLink = useMemo(
    () => nestedLink || links.find(link => link.id === activeLink) || links[0],
    [activeLink, links, nestedLink]
  );

  const toggleDialog = () => {
    toggleMenuOpened();
  };

  return (
    <StyledContainer>
      <Root>
        {isGreaterThanTablet ? (
          <Menu>
            {links.map(link => (
              <SidebarLink
                key={link.id}
                active={activeLink === link.id}
                activeLink={activeLink}
                onClick={() => {
                  if (onClick) onClick(link.id);
                }}
                onClickNested={(id: ID) => {
                  if (onClick) onClick(id);
                }}
                {...link}
                toggleMenuOpened={toggleDialog}
              />
            ))}
          </Menu>
        ) : (
          <>
            <MobileContainer>
              <SidebarLink
                key={mobileLink.id}
                {...mobileLink}
                onClick={() => {
                  toggleMenuOpened();
                }}
                active={false}
                toggleMenuOpened={toggleDialog}
              />
              <MobileExpand
                color="white"
                icon={faCaretDown}
                onClick={() => {
                  toggleMenuOpened();
                }}
              />
            </MobileContainer>
            <Dialog open={menuOpened} onClose={toggleMenuOpened} title="Select">
              <DialogContent>
                {links.map(link => {
                  const { onClick: linkClick } = link;
                  return (
                    <SidebarLink
                      {...link}
                      key={link.id}
                      active={activeLink === link.id}
                      activeLink={activeLink}
                      onClick={() => {
                        if (!link.nested) toggleMenuOpened();
                        if (linkClick) {
                          linkClick();
                        } else if (onClick) {
                          onClick(link.id);
                        }
                      }}
                      onClickNested={(id: ID) => {
                        if (onClick) onClick(id);
                      }}
                      toggleMenuOpened={toggleDialog}
                    />
                  );
                })}
              </DialogContent>
            </Dialog>
          </>
        )}
        <Content>{children}</Content>
      </Root>
    </StyledContainer>
  );
};

export default SidebarLayout;
