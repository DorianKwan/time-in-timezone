import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import sweetAlert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { coreServiceApi } from 'src/api';
import { useAsyncEffect, useTypedTheme } from 'src/hooks';
import { ApiData } from 'time-in-timezone-shared';
import { AnimatedText, FadeIn, Loader } from '../utility';

const ANIMATED_TEXT_DURATION = 0.05;
const FADE_IN_DELAY = 0.4;
const FADE_IN_DURATION = 1.75;
const DEFAULT_DATETIME_STRING = '1970-01-01T00:00:00.000Z';
const DEFAULT_SELECTED_DATETIME = 'When it all began..';

interface TimezoneTimeProps {
  timezoneOptions: ApiData.TimezoneOptions;
}

export const TimezoneTime: React.VFC<TimezoneTimeProps> = () => {
  const theme = useTypedTheme();

  const [datetimeString, setDatetimeString] = useState(DEFAULT_DATETIME_STRING);
  const [selectedTimezone, setSelectedTimezone] = useState(
    DEFAULT_SELECTED_DATETIME,
  );

  const [inputVal, setInputVal] = useState<string>('');
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

  const onSearch = () => {
    setInputError(false);
    setSelectedTimezone(inputVal);
    setInputVal('');
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
        <InputWrapper>
          <TimezoneInput
            placeholder="Timezone.."
            onChange={event => setInputVal(event.currentTarget.value)}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                onSearch();
              }
            }}
            focusedBorderColor={
              inputError ? theme.colors.darkRed : theme.colors.blue
            }
            value={inputVal}
          />
          <ButtonWrapper>
            <ActionButton
              type="button"
              aria-label="search for time in timezone"
              onClick={() => onSearch()}
              bgColor={theme.colors.green}
              hoverColor={theme.colors.darkGreen}>
              Search
            </ActionButton>
            <ActionButton
              type="button"
              aria-label="clear timezone input"
              onClick={() => setInputVal('')}
              bgColor={theme.colors.red}
              hoverColor={theme.colors.darkRed}>
              Clear
            </ActionButton>
          </ButtonWrapper>
        </InputWrapper>
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

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 3.5fr 1fr;
  grid-template-rows: 1fr;
  gap: 0.75rem;
  width: 100%;
  max-width: 40rem;
  margin: 0 auto;
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding-bottom: 1rem;
  width: 100%;

  & > button:not(:last-of-type) {
    margin-right: 0.5rem;
  }
`;

const ActionButton = styled.button<{
  bgColor: string;
  hoverColor: string;
}>`
  border: none;
  color: white;
  background: ${props => props.bgColor};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0.5rem 1rem;
  transition: background 0.25s ease-in-out;
  border-radius: 0.75rem;

  &:hover,
  &:focus {
    background: ${props => props.hoverColor};
    cursor: pointer;
  }

  @media only screen and (min-width: 1200px) {
    font-size: 1.6rem;
  }
`;

const TimezoneInput = styled.input<{ focusedBorderColor: string }>`
  font-size: 1.125rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border-style: none;
  border: 1px solid black;
  margin-bottom: 1rem;

  &:focus-visible {
    outline: none;
    border: 1px solid ${({ focusedBorderColor }) => focusedBorderColor};
    box-shadow: 0 0 1px 1px ${({ focusedBorderColor }) => focusedBorderColor};
  }

  @media only screen and (min-width: 1200px) {
    font-size: 1.6rem;
    padding: 0.5rem 1.25rem;
  }
`;
