import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAsyncEffect } from 'src/hooks';
import { coreServiceApi } from 'src/api';
import { ApiData } from 'time-in-timezone-shared';
import { Loader, PageWrapper } from '../utility';
import { TimezoneTime } from '../timezone-time';

export const Home = () => {
  const [timezoneOptions, setTimezoneOptions] =
    useState<ApiData.TimezoneOptions>();

  useAsyncEffect(async () => {
    const availableTimezoneOptions =
      await coreServiceApi.timeInTimezone.getTimezoneOptions();

    setTimezoneOptions(availableTimezoneOptions);
  }, []);

  if (!timezoneOptions) {
    return <Loader />;
  }

  return (
    <HomePageWrapper>
      <TimezoneTime timezoneOptions={timezoneOptions} />
    </HomePageWrapper>
  );
};

const HomePageWrapper = styled(PageWrapper)`
  display: grid;
  place-items: center;
`;
