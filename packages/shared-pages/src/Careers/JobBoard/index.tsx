/* eslint-disable react/no-unescaped-entities */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import SimpleSelect, {
  SimpleSelectOption,
} from '@sorare/core/src/components/form/Form/SimpleSelect';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { groupBy } from '@sorare/core/src/lib/arrays';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import videoLogo3D from '../assets/logo-3d.mp4';
import { Department, Job } from '../types';
import { Section, StyledContainer, Title, TwoColumnsContainer } from '../ui';

const LoadingPlaceholder = styled.div`
  padding: calc(10 * var(--unit)) 0;
`;
const BlackSection = styled(Section)`
  background-color: black;
  padding: var(--triple-unit) 0 var(--quadruple-unit);
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  @media ${laptopAndAbove} {
    flex-direction: row;
  }
  & > * {
    flex: 1;
  }
`;
const FormLabel = styled(Text16)`
  margin-bottom: var(--unit);
`;
const JobsCount = styled(Text14)`
  margin-top: var(--unit);
`;
const AlignRightContainer = styled.div`
  text-align: right;
`;
const DepartmentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  @media ${laptopAndAbove} {
    flex-direction: row;
  }
`;
const DepartmentColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;
const DepartmentTitle = styled(Title)`
  margin-left: var(--unit);
  margin-bottom: var(--double-unit);
  color: var(--c-brand-600);
`;
const JobContainer = styled(Button)`
  width: 100%;
  height: auto;
  display: block;
  text-align: left;
  padding: var(--unit);

  &:hover {
    background-color: rgba(var(--c-rgb-brand-600), 0.1);
  }
  &:not(:last-of-type) {
    margin-bottom: var(--double-unit);
  }
`;
const JobTitle = styled(Text16)`
  white-space: break-spaces;
`;
const Location = styled(Text14)`
  margin: 0;
`;

type Props = {
  jobs: Job[];
};

export const JobBoard = ({ jobs }: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');

  const [department, setDepartment] = useState<string>('');
  const [office, setOffice] = useState<string>('');

  const officesOptions: SimpleSelectOption[] = useMemo(
    () => [
      { label: 'All offices', value: '' },
      ...Array.from(new Set(jobs.map(job => job.location))).map(off => ({
        label: off,
        value: off,
      })),
    ],
    [jobs]
  );

  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        job =>
          (!office || job.location === office) &&
          (!department || job.department === department)
      ),
    [department, office, jobs]
  );

  const departments = useMemo(
    () => Array.from(new Set(filteredJobs.map(job => job.department))),
    [filteredJobs]
  );
  const departmentsOptions: SimpleSelectOption[] = useMemo(
    () => [
      { label: 'All departments', value: '' },
      ...departments.map(dept => ({ label: dept, value: dept })),
    ],
    [departments]
  );

  const jobsLayout = useMemo(() => {
    const columns: Department[][] = [[], [], []];
    const oneThirdTotalJobs = Math.ceil(filteredJobs.length / 3);
    Object.entries(groupBy(job => job.department, filteredJobs)).forEach(
      ([dept, deptJobs]) => {
        for (let i = 0; i < columns.length; i += 1) {
          const depts: Department[] = columns[i];
          const sizeColumn = depts.reduce((acc, d) => acc + d.jobs.length, 0);
          if (
            sizeColumn + deptJobs.length <= oneThirdTotalJobs ||
            sizeColumn === 0
          ) {
            columns[i].push({ name: dept, jobs: deptJobs });
            break;
          }
        }
      }
    );
    return columns;
  }, [filteredJobs]);

  if (filteredJobs.length === 0) {
    return (
      <LoadingPlaceholder>
        <LoadingIndicator />
      </LoadingPlaceholder>
    );
  }

  return (
    <>
      <BlackSection center={!isLaptop}>
        <StyledContainer>
          <TwoColumnsContainer image="right">
            <div>
              <Title white>Vicc Careers</Title>
              <Form>
                <SimpleSelect
                  value={department}
                  onChange={e =>
                    setDepartment((e.target as HTMLInputElement)?.value)
                  }
                  label={
                    <FormLabel color="var(--c-neutral-100)">
                      Department
                    </FormLabel>
                  }
                  name="department"
                  options={departmentsOptions}
                />
                <SimpleSelect
                  value={office}
                  onChange={e =>
                    setOffice((e.target as HTMLInputElement)?.value)
                  }
                  label={
                    <FormLabel color="var(--c-neutral-100)">Office</FormLabel>
                  }
                  name="office"
                  options={officesOptions}
                />
              </Form>
              <JobsCount color="var(--c-neutral-100)">
                {filteredJobs.length} jobs found
              </JobsCount>
            </div>
            {isLaptop && (
              <AlignRightContainer>
                <video autoPlay muted loop playsInline src={videoLogo3D}>
                  <source srcSet={videoLogo3D} />
                </video>
              </AlignRightContainer>
            )}
          </TwoColumnsContainer>
        </StyledContainer>
      </BlackSection>
      {filteredJobs.length && (
        <Section spacing>
          <StyledContainer>
            <DepartmentsContainer>
              {jobsLayout.map((depts, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <DepartmentColumn key={`column-${i}`}>
                  {depts.map(dept => (
                    <div key={dept.name}>
                      <DepartmentTitle>{dept.name}</DepartmentTitle>
                      {dept.jobs.map(job => (
                        <JobContainer
                          key={job.id}
                          component={Link}
                          to={`?jid=${job.id}`}
                        >
                          <JobTitle color="var(--c-neutral-800)">
                            {job.title}
                          </JobTitle>
                          <Location color="var(--c-neutral-600)">
                            {job.location}
                          </Location>
                        </JobContainer>
                      ))}
                    </div>
                  ))}
                </DepartmentColumn>
              ))}
            </DepartmentsContainer>
          </StyledContainer>
        </Section>
      )}
    </>
  );
};
