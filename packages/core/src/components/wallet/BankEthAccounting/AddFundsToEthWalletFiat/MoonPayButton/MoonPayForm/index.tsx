import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import useQuery from '@core/hooks/graphql/useQuery';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { MOONPAY_URL } from '../../../../../../config';
import {
  MoonpayParamsQuery,
  MoonpayParamsQueryVariables,
} from './__generated__/index.graphql';

export const MOONPAY_PARAMS_QUERY = gql`
  query MoonpayParamsQuery {
    currentUser {
      slug
      moonpayParams
    }
  }
` as TypedDocumentNode<MoonpayParamsQuery, MoonpayParamsQueryVariables>;

const Iframe = styled.iframe`
  width: 100%;
  max-width: calc(100vw - 20px);
  border: 0;
  overflow: hidden;
  height: 100vh;
  @media ${tabletAndAbove} {
    height: 80vh;
    max-height: 750px;
  }
`;

export const MoonpayForm = () => {
  const { data, loading } = useQuery(MOONPAY_PARAMS_QUERY);
  const { refetch } = useCurrentUserContext();

  useEffect(() => {
    // Allows user to see funds on their Eth balance before closing modal
    const stopRefetch = setInterval(() => {
      refetch();
    }, 2000);
    return () => {
      clearInterval(stopRefetch);
      // Update available balance
      refetch();
    };
  }, [refetch]);

  if (loading || !data?.currentUser) {
    return null;
  }

  const { moonpayParams } = data.currentUser;

  return (
    <Iframe
      data-testid="moon-pay-form"
      src={`${MOONPAY_URL}${moonpayParams}`}
      title="MoonPay"
      height="100%"
      width="100%"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    />
  );
};

export default MoonpayForm;
