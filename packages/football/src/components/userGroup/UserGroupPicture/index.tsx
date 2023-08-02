import styled, { css } from 'styled-components';

const commonStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--triple-unit);
  background-color: var(--c-neutral-300);
`;
const GroupPicture = styled.div`
  ${commonStyle}
  background: center / cover no-repeat;
`;
const GroupFirstLetter = styled.div`
  ${commonStyle}
  color: var(--c-static-neutral-100);
  font-size: 48px;
  .dark-theme & {
    border-color: var(--c-neutral-1000);
  }
`;

type Props = {
  picture?: string;
  displayName: string;
  size?: number;
  className?: string;
  raffleEligible?: boolean;
};
const UserGroupPicture = ({ picture, displayName, size, className }: Props) => {
  return picture ? (
    <GroupPicture
      style={{
        backgroundImage: `url(${picture})`,
        width: size || 80,
        height: size || 80,
      }}
      className={className}
    />
  ) : (
    <GroupFirstLetter
      style={{
        width: size || 80,
        height: size || 80,
      }}
      className={className}
    >
      {displayName.charAt(0)}
    </GroupFirstLetter>
  );
};

export default UserGroupPicture;
