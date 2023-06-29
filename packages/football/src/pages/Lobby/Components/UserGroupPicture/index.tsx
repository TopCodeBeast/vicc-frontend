import styled, { css } from 'styled-components';

type Props = {
  picture?: string;
  displayName: string;
  size?: number;
  className?: string;
  raffleEligible?: boolean;
};

const commonStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--double-unit);
  border-radius: var(--triple-unit);
  box-shadow: 0 3px 12px 0 rgba(var(--c-rgb-neutral-1000), 0.1);
`;

const GroupPicture = styled.div`
  ${commonStyle}
  background: center / cover no-repeat;
  background-color: var(--c-neutral-100);
`;

const GroupFirstLetter = styled.div`
  ${commonStyle}
  color: var(--c-static-neutral-100);
  font-size: 48px;
  background-color: var(--c-neutral-1000);
  border: 4px solid var(--c-neutral-100);
  .dark-theme & {
    background-color: var(--c-neutral-200);
    border-color: var(--c-neutral-1000);
  }
`;

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
