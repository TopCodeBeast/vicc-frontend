import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import DotsLoader from '@sorare/core/src/atoms/loader/DotsLoader';

import UninteractiveStarterBundlePreviewSkeleton from '@football/components/starterBundle/UninteractiveStarterBundlePreviewSkeleton';

const Line = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: var(--double-unit);
  border-top: 1px solid var(--c-neutral-300);
`;
export const LoadingPrimaryOfferPreview = () => {
  return (
    <>
      <UninteractiveStarterBundlePreviewSkeleton />
      <Line>&nbsp;</Line>
      <Line>
        <Button color="blue" medium>
          <DotsLoader />
        </Button>
      </Line>
    </>
  );
};

export default LoadingPrimaryOfferPreview;
