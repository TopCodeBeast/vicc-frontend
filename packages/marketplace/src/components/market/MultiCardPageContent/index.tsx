import { ReactNode } from 'react';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import CardsPreviewContainer from '@sorare/core/src/components/bundled/CardsPreviewContainer';

const Page = styled.div`
  background-color: var(--c-neutral-1000);
  .dark-theme & {
    color: var(--c-neutral-1000);
    background: linear-gradient(
        180deg,
        rgba(var(--c-rgb-neutral-100), 0.8) 0%,
        var(--c-neutral-200) 375px
      ),
      var(--c-neutral-1000);
  }
`;

const HeaderLayout = styled.div`
  padding: var(--triple-unit) 0;
`;
const DetailsLayout = styled.div`
  padding: var(--quadruple-unit) 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;
const PreviewContainer = styled.div`
  max-width: 526px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const CardsContainer = styled(Container)`
  border-top-left-radius: var(--double-unit);
  border-top-right-radius: var(--double-unit);
  background-color: var(--c-neutral-100);

  .dark-theme & {
    background-color: transparent;
  }
`;

type Props = {
  cardsPreview: ReactNode;
  detailsContent?: ReactNode;
  customPreview?: ReactNode;
};

export const MultiCardPageContent = ({
  cardsPreview,
  detailsContent,
  customPreview,
}: Props) => {
  return (
    <Page>
      {customPreview || (
        <Container>
          <HeaderLayout>
            <PreviewContainer>
              <CardsPreviewContainer>{cardsPreview}</CardsPreviewContainer>
            </PreviewContainer>
          </HeaderLayout>
        </Container>
      )}
      <CardsContainer>
        <DetailsLayout>{detailsContent}</DetailsLayout>
      </CardsContainer>
    </Page>
  );
};

export default MultiCardPageContent;
