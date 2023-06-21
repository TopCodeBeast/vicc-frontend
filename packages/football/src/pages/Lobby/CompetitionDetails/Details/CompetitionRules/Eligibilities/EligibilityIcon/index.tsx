import styled from 'styled-components';

import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { BlockchainScarcity } from '@sorare/core/src/lib/cards';

const Wrapper = styled.div`
  position: relative;
`;

const MainIcon = styled.div`
  position: relative;
`;

const BgIcon1 = styled.div`
  position: absolute;
  transform: translate(10%, -10%) rotate(4.33deg);
  opacity: 0.7;
`;

const BgIcon2 = styled.div`
  position: absolute;
  transform: translate(20%, -20%) rotate(10.47deg);
  opacity: 0.4;
`;

type Props = {
  limit: number;
  scarcity: BlockchainScarcity;
};

const EligibilityIcon = ({ limit, scarcity }: Props) => {
  return (
    <Wrapper>
      <BgIcon2>
        <ScarcityIcon scarcity={scarcity} size="lg" />
      </BgIcon2>
      <BgIcon1>
        <ScarcityIcon scarcity={scarcity} size="lg" />
      </BgIcon1>

      <MainIcon>
        <ScarcityIcon scarcity={scarcity} size="lg">
          <Text14 bold color="var(--c-static-neutral-100)">
            {limit}
          </Text14>
        </ScarcityIcon>
      </MainIcon>
    </Wrapper>
  );
};

export default EligibilityIcon;
