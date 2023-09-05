/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Body from '@sorare/core/src/atoms/layout/Body';
import { useSeoContext } from '@sorare/core/src/contexts/seo';
import useQueryString from '@sorare/core/src/hooks/useQueryString';

import { About } from './About';
import { BuildYourCareer } from './BuildYourCareer';
import { Careers as CareersSection } from './Careers';
import { History } from './History';
import { JobBoard } from './JobBoard';
import { JobForm } from './JobForm';
import { LifeAtVicc } from './Life';
import { Mission } from './Mission';
import { Stakeholders } from './Stakeholders';
import { Job } from './types';

const InnerBody = styled.div`
  max-width: 2200px;
  margin: auto;
`;

const Careers = () => {
  const location = useLocation();
  const { setPageMetadata } = useSeoContext();

  const anchorRef = useRef<HTMLDivElement>(null);
  const jid = useQueryString('jid');

  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => setPageMetadata('Careers'), [setPageMetadata]);

  useEffect(() => {
    fetch('https://api.ashbyhq.com/posting-api/job-board/sorare')
      .then(async response => response.json())
      .then(data => {
        setJobs(data.jobs as Job[]);
      });
  }, []);

  useEffect(() => {
    if (!jid && jobs.length && location.hash === '#jobs') {
      setTimeout(() => {
        if (anchorRef.current) {
          window.scroll({ top: anchorRef.current?.offsetTop - 100 });
        }
      }, 100);
    }
  }, [jobs, jid, location.hash]);

  const job = jobs.find(j => j.id === jid);

  return (
    <Body>
      <InnerBody>
        <CareersSection />
        {!job && (
          <>
            <About />
            <History />
            <Stakeholders />
            <Mission />
            <BuildYourCareer />
            <LifeAtVicc />
          </>
        )}
        <div id="jobs" ref={anchorRef} />
        {job ? (
          <JobForm job={job} anchorRef={anchorRef} />
        ) : (
          <JobBoard jobs={jobs} />
        )}
      </InnerBody>
    </Body>
  );
};

export default Careers;
