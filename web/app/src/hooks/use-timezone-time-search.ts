import { useState, useRef, useEffect } from 'react';
import { coreServiceApi } from 'src/api';
import { useAsyncEffect } from 'src/hooks';

const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentDatetime = new Date();

const DEFAULT_DATETIME_STRING = currentDatetime.toISOString();
const DEFAULT_SELECTED_DATETIME = currentTimezone;

export const useTimezoneTimeSearch = () => {
  const [datetimeString, setDatetimeString] = useState(DEFAULT_DATETIME_STRING);
  const [selectedTimezone, setSelectedTimezone] = useState(
    DEFAULT_SELECTED_DATETIME,
  );

  const [inputError, setInputError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  const prevDatetimeRef = useRef<string>(DEFAULT_DATETIME_STRING);
  const prevTimezoneRef = useRef<string>(DEFAULT_SELECTED_DATETIME);

  const fetchUpdatedTimezoneTime = async () => {
    try {
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }

      const { datetime: timezoneDatetime } =
        await coreServiceApi.timeInTimezone.getTimezoneTime(selectedTimezone);

      prevDatetimeRef.current = datetimeString;
      prevTimezoneRef.current = selectedTimezone;

      setDatetimeString(timezoneDatetime);
    } catch (err) {
      setDatetimeString(prevDatetimeRef.current || DEFAULT_DATETIME_STRING);
      setSelectedTimezone(prevTimezoneRef.current || DEFAULT_SELECTED_DATETIME);

      // error handling isn't ideal here and could be improved
      setErrorMessage(
        err instanceof Error ? err.message : 'Please check your connection',
      );
    }

    if (isInitialLoad) {
      setIsLoading(false);
    }
  };

  useAsyncEffect(async () => {
    const isTimezonePrev = selectedTimezone === prevTimezoneRef.current;
    const isDefaultTimezone = selectedTimezone === DEFAULT_SELECTED_DATETIME;

    if (!isTimezonePrev && !isDefaultTimezone) {
      await fetchUpdatedTimezoneTime();
    } else {
      setIsLoading(false);
    }
  }, [selectedTimezone]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUpdatedTimezoneTime();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  });

  const onSearch = (inputVal: string) => {
    setInputError(false);
    setSelectedTimezone(inputVal);
  };

  return {
    selectedTimezone,
    datetimeString,
    onSearch,
    setInputError,
    inputError,
    errorMessage,
    isLoading,
  };
};
