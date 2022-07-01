import React from 'react';
import styled from '@emotion/styled';
import sweetAlert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTimezoneTimeSearch } from 'src/hooks';
import { ApiData } from 'time-in-timezone-shared';
import { formatInTimeZone } from 'date-fns-tz';
import { Loader, InputDropdownSelect } from '../utility';

interface TimezoneTimeProps {
  timezoneOptions: ApiData.TimezoneOptions;
}

export const TimezoneTime: React.VFC<TimezoneTimeProps> = ({
  timezoneOptions,
}) => {
  const {
    selectedTimezone,
    datetimeString,
    onSearch,
    setInputError,
    inputError,
    errorMessage,
    isLoading,
  } = useTimezoneTimeSearch();

  if (inputError) {
    MySweetAlert.fire({
      title: 'Error Fetching Time',
      text: errorMessage,
      icon: 'error',
    });
  }

  if (isLoading) {
    return <Loader />;
  }

  const readableDatetime = formatInTimeZone(
    datetimeString,
    selectedTimezone,
    'MMM do yyyy, h:mm:ssaa',
  );

  return (
    <Container>
      <TimezoneHeading>Time in Timezone</TimezoneHeading>
      <TimezoneInfo>{selectedTimezone}</TimezoneInfo>
      <TimezoneInfo>{readableDatetime}</TimezoneInfo>
      <InputDropdownSelect
        options={timezoneOptions}
        onSearch={onSearch}
        inputError={inputError}
        setInputError={setInputError}
      />
    </Container>
  );
};

const MySweetAlert = withReactContent(sweetAlert);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 3rem;
`;

const TimezoneHeading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;

  @media only screen and (min-width: 1200px) {
    font-size: 3.75rem;
    margin-bottom: 1.5rem;
  }
`;

const TimezoneInfo = styled.p`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;

  :last-of-type {
    margin-bottom: 2.25rem;
  }

  @media only screen and (min-width: 1200px) {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;

    :last-of-type {
      margin-bottom: 3.25rem;
    }
  }
`;
