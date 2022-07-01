import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import sweetAlert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { coreServiceApi } from 'src/api';
import { useAsyncEffect, useTypedTheme } from 'src/hooks';
import { ApiData } from 'time-in-timezone-shared';
import { AnimatedText, FadeIn, Loader, InputDropdownSelect } from '../utility';

const ANIMATED_TEXT_DURATION = 0.05;
const FADE_IN_DELAY = 0.4;
const FADE_IN_DURATION = 1.75;
const DEFAULT_DATETIME_STRING = '1970-01-01T00:00:00.000Z';
const DEFAULT_SELECTED_DATETIME = 'When it all began..';

interface TimezoneTimeProps {
  timezoneOptions: ApiData.TimezoneOptions;
}

export const TimezoneTime: React.VFC<TimezoneTimeProps> = ({
  timezoneOptions,
}) => {
  const [datetimeString, setDatetimeString] = useState(DEFAULT_DATETIME_STRING);
  const [selectedTimezone, setSelectedTimezone] = useState(
    DEFAULT_SELECTED_DATETIME,
  );

  const [inputError, setInputError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const prevDatetimeRef = useRef<string>(DEFAULT_DATETIME_STRING);
  const prevTimezoneRef = useRef<string>(DEFAULT_SELECTED_DATETIME);

  useAsyncEffect(async () => {
    const isTimezonePrev = selectedTimezone === prevTimezoneRef.current;
    const isDefaultTimezone = selectedTimezone === DEFAULT_SELECTED_DATETIME;

    if (!isTimezonePrev && !isDefaultTimezone) {
      try {
        setIsLoading(true);

        const { datetime: timezoneDatetime } =
          await coreServiceApi.timeInTimezone.getTimezoneTime(selectedTimezone);

        prevDatetimeRef.current = datetimeString;
        prevTimezoneRef.current = selectedTimezone;

        setDatetimeString(timezoneDatetime);
        setIsLoading(false);
      } catch (err) {
        setDatetimeString(prevDatetimeRef.current || DEFAULT_DATETIME_STRING);
        setSelectedTimezone(
          prevTimezoneRef.current || DEFAULT_SELECTED_DATETIME,
        );
        setIsLoading(false);

        // error handling isn't ideal here and could be improved
        const errorMessage =
          err instanceof Error ? err.message : 'Please check your connection';

        MySweetAlert.fire({
          title: 'Error Fetching Time',
          text: errorMessage,
          icon: 'error',
        });
      }
    } else {
      setIsLoading(false);
    }
  }, [selectedTimezone]);

  if (isLoading) {
    return <Loader />;
  }

  const onSearch = (inputVal: string) => {
    setInputError(false);
    setSelectedTimezone(inputVal);
  };

  return (
    <Container>
      <TimezoneHeading>
        <AnimatedText
          capitalize
          duration={ANIMATED_TEXT_DURATION}
          content="Time in Timezone"
        />
      </TimezoneHeading>
      <TimezoneInfo>
        <AnimatedText
          duration={ANIMATED_TEXT_DURATION}
          content={selectedTimezone}
        />
      </TimezoneInfo>
      <TimezoneInfo>
        <AnimatedText
          capitalize
          duration={ANIMATED_TEXT_DURATION}
          content={datetimeString}
        />
      </TimezoneInfo>
      <FadeIn delay={FADE_IN_DELAY} duration={FADE_IN_DURATION}>
        <InputDropdownSelect
          options={timezoneOptions}
          onSearch={onSearch}
          inputError={inputError}
          setInputError={setInputError}
        />
      </FadeIn>
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
