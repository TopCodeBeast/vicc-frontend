import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faCaretLeft } from '@fortawesome/pro-solid-svg-icons';
import { Menu } from '@material-ui/core';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import MenuIconButton from '@sorare/core/src/routing/MultiSportAppBar/MenuIconButton';
import { useAppBarContext } from '@sorare/core/src/routing/MultiSportAppBar/context';
import { OverrideClasses } from '@sorare/core/src/style/utils';

import MultiSportSearchBar from '../MultiSportSearchBar';

const Top = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 20px;
  max-width: 100%;
`;

const [StyledMenu, classes] = OverrideClasses(Menu, null, {
  menuPaper: css`
    width: 300px;
    flex-shrink: 0;
    border-radius: 8px;
    background-color: var(--c-neutral-200);
    &:not(.isDesktop) {
      top: 0px !important;
      left: 0px !important;
      flex-shrink: unset;
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  `,
});

export const ResponsiveSearchBar = () => {
  const { up: isDesktop } = useScreenSize('desktop');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [onExit, setOnExit] = useState<boolean>(false);
  const { small } = useAppBarContext();

  const onClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const toggleOpen = useCallback(event => {
    setMenuAnchor(anchor => {
      if (anchor) return null;

      return event.currentTarget;
    });
  }, []);

  return (
    <>
      <MenuIconButton
        icon={faSearch}
        onClick={toggleOpen}
        disableRipple={small}
        active={Boolean(menuAnchor)}
      />
      <StyledMenu
        id="search-menu"
        anchorEl={menuAnchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        getContentAnchorEl={null}
        open={Boolean(menuAnchor)}
        onClose={onClose}
        classes={{ paper: classNames(classes.menuPaper, { isDesktop }) }}
        TransitionProps={{
          onExit: () => setOnExit(true),
          onExited: () => setOnExit(false),
        }}
      >
        <Top>
          {!isDesktop && (
            <IconButton color="white" icon={faCaretLeft} onClick={onClose} />
          )}
          <MultiSportSearchBar onExit={onExit} onSelect={onClose} />
        </Top>
      </StyledMenu>
    </>
  );
};

export default ResponsiveSearchBar;
