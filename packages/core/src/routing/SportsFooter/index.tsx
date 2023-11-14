import classNames from 'classnames';
import styled from 'styled-components';

import { Container } from '@core/atoms/container';
import { Text16 } from '@core/atoms/typography';
import { SocialLinks } from '@core/atoms/ui/SocialMedias';
import LanguageSwitcher from '@core/components/user/LanguageSwitcher';
import { tabletAndAbove } from '@core/style/mediaQuery';

import FooterLinks from './FooterLinks';
import socialLinks from './socialLinks';

const Footer = styled(Container)`
  padding: var(--triple-unit) var(--double-unit);
  background: rgb(0, 0, 0, 0.6);
  color: var(--c-neutral-100);
  position: relative;
`;
const CopyAndLanguage = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit) 0;
  @media ${tabletAndAbove} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const CopyContainer = styled(Text16)`
  @media ${tabletAndAbove} {
    text-align: right;
  }
`;
const Divider = styled.div`
  width: 100%;
  background: white;
  height: 1px;
`;

type Props = {
  className?: string;
};

const SportsFooter = ({ className }: Props) => {
  return (
    <Footer as="footer" className={classNames(className, 'light-theme')}>
      <FooterLinks />
      <Divider />
      <CopyAndLanguage>
        <CopyContainer>
          © {new Date().getFullYear()} Vicc, SAS. All Rights Reserved.
        </CopyContainer>
        <SocialLinks socialLinks={socialLinks} />
      </CopyAndLanguage>
    </Footer>
  );
};

export default SportsFooter;
