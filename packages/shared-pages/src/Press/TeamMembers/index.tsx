import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { Romie20 } from '@sorare/core/src/components/marketing/typography';
import {
  mobileAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { TeamMember as TeamMemberType, teamMembers } from './data';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: var(--half-unit);
  grid-row-gap: var(--double-unit);
  flex-wrap: wrap;
  @media ${mobileAndAbove} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(4, 1fr);
    grid-row-gap: var(--quadruple-unit);
  }
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--unit);

  @media ${tabletAndAbove} {
    gap: var(--double-unit);
  }
`;

const PictureCtn = styled.div`
  overflow: hidden;
`;

const Picture = styled.img<{ image?: string }>`
  aspect-ratio: 1;
  width: 100%;
  background-size: cover;
  background-position: center;
  ${({ image }) =>
    image
      ? `background-image: url(${image});`
      : 'background-color: var(--c-static-neutral-800);'}

  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.015);
  }

  @media ${tabletAndAbove} {
    aspect-ratio: 0.71;
  }
`;

const Metas = styled.div``;

type TeamMemberProps = {
  member: TeamMemberType;
};
const TeamMember = ({ member }: TeamMemberProps) => {
  const { name, role, pictureUrl } = member;
  return (
    <Item>
      <PictureCtn>
        <Picture image={pictureUrl} />
      </PictureCtn>
      <Metas>
        <Romie20>{name}</Romie20>
        <Text16>{role}</Text16>
      </Metas>
    </Item>
  );
};

export const TeamMembers = () => {
  return (
    <Wrapper>
      {teamMembers.map(member => (
        <TeamMember key={member.name} member={member} />
      ))}
    </Wrapper>
  );
};
