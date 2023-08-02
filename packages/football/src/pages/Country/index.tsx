import { TypedDocumentNode, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import Body from '@sorare/core/src/atoms/layout/Body';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title3 } from '@sorare/core/src/atoms/typography';
import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { metadatas } from '@sorare/core/src/lib/seo/football';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import Follower from '@football/components/favorites/Follower';
import PageContextProvider, { pageContextFragments } from '@football/contexts/page';

import Search from './Search';
import {
  CountryQuery,
  CountryQueryVariables,
} from './__generated__/index.graphql';

export const COUNTRY_QUERY = gql`
  query CountryQuery($slug: String!) {
    country(slug: $slug) {
      slug
      code
      ...PageContext_subscribable
      ...CountrySearch_country
    }
  }
  ${pageContextFragments.subscribable}

  ${Search.fragments.country}
` as TypedDocumentNode<CountryQuery, CountryQueryVariables>;

const Wrapper = styled(Container)`
  color: var(--c-neutral-1000);
`;

const Header = styled.div`
  margin-bottom: 55px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const CountryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;
const Logo = styled.div`
  height: 65px;
  margin-right: 15px;
  display: flex;
  align-items: center;
`;

export const Country = () => {
  const { slug } = useParams();
  const { data, loading } = useQuery(COUNTRY_QUERY, {
    variables: {
      slug: slug!,
    },
    skip: !slug,
  });

  useTitleAndDescription(
    metadatas.country.title,
    metadatas.country.description,
    !!data?.country && {
      country: toDisplayName(data.country.code),
    }
  );

  if (loading && !data) return <LoadingIndicator />;
  if (!data) return null;
  const { country } = data;

  return (
    <PageContextProvider value={{ object: country }}>
      <Body>
        <Wrapper>
          <Header>
            <CountryHeader>
              <Logo>
                <FlagAvatar country={country} imageRes={64} />
              </Logo>
              <Title3>{toDisplayName(country.code)}</Title3>
            </CountryHeader>
            <Follower />
          </Header>
          <Search country={country} />
        </Wrapper>
      </Body>
    </PageContextProvider>
  );
};

export default Country;
