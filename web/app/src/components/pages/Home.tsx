import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAsyncEffect } from 'src/hooks';
import { coreServiceApi } from 'src/api';
import { ApiData } from 'time-in-timezone-shared';
import { PageWrapper } from '../utility';

export const Home = () => {
  const [timezoneOptions, setTimezoneOptions] =
    useState<ApiData.TimezoneOptions>();

  useAsyncEffect(async () => {
    const availableTimezoneOptions =
      await coreServiceApi.timeInTimezone.getTimezoneOptions();

    setTimezoneOptions(availableTimezoneOptions);
  }, []);

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
