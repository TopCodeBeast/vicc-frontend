import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RefObject, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title2 } from '@sorare/core/src/atoms/typography';

import { Job } from '@shared-pages/Careers/types';

import { Section, StyledContainer } from '../ui';

type Props = {
  job: Job;
  anchorRef: RefObject<HTMLDivElement>;
};

const Container = styled.div`
  & p {
    margin: revert;
  }

  & li {
    list-style-type: circle;
  }
`;

const ButtonContainer = styled.div`
  margin-bottom: var(--quadruple-unit);
`;

export const JobForm = ({ job, anchorRef }: Props) => {
  const [formerJob, setFormerJob] = useState<Job | undefined>(undefined);

  useEffect(() => {
    // Scroll to top of frame on navigation
    // Reserve some space for nav bar & view all jobs link
    if (anchorRef.current && formerJob) {
      window.scroll({ top: anchorRef.current?.offsetTop - 100 });
    }
    setFormerJob(job);
  }, [anchorRef, formerJob, job]);

  return (
    <Section spacing>
      <StyledContainer>
        <ButtonContainer>
          <Button
            color="blue"
            small
            startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
            component={Link}
            to="#jobs"
          >
            View all Jobs
          </Button>
        </ButtonContainer>
        <Title2>{job.title}</Title2>
        {/* eslint-disable-next-line react/no-danger */}
        <Container dangerouslySetInnerHTML={{ __html: job.descriptionHtml }} />
        <Button color="blue" medium href={job.applyUrl} externalLink>
          Apply
        </Button>
      </StyledContainer>
    </Section>
  );
};
