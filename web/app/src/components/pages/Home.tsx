import React from 'react';
import styled from '@emotion/styled';
import { PageWrapper } from '../utility';

export const Home = () => {
  return (
    <HomePageWrapper>
      <HomeHeading>Home</HomeHeading>
    </HomePageWrapper>
  );
};

const HomePageWrapper = styled(PageWrapper)`
  display: grid;
  place-items: center;
`;

const HomeHeading = styled.h1`
  text-align: center;
`;
