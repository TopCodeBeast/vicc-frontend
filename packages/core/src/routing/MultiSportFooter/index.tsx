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
  background: var(--c-neutral-1000);
  color: var(--c-neutral-100);
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

type Props = {
  className?: string;
};

const MultiSportFooter = ({ className }: Props) => {
  return (
    <Footer as="footer" className={classNames(className, 'light-theme')}>
      <SocialLinks socialLinks={socialLinks} />
      <FooterLinks />
      <CopyAndLanguage>
        <LanguageSwitcher />
        <CopyContainer>
          © {new Date().getFullYear()} Vicc, SAS. All Rights Reserved.
        </CopyContainer>
      </CopyAndLanguage>
    </Footer>
  );
};

export default MultiSportFooter;
