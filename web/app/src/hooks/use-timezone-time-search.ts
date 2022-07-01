import { useState, useRef } from 'react';
import { coreServiceApi } from 'src/api';
import { useAsyncEffect } from 'src/hooks';

const DEFAULT_DATETIME_STRING = '1970-01-01T00:00:00.000Z';
const DEFAULT_SELECTED_DATETIME = 'When it all began..';

export const useTimezoneTimeSearch = () => {
  const [datetimeString, setDatetimeString] = useState(DEFAULT_DATETIME_STRING);
  const [selectedTimezone, setSelectedTimezone] = useState(
    DEFAULT_SELECTED_DATETIME,
  );

  const [inputError, setInputError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
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
        setErrorMessage(
          err instanceof Error ? err.message : 'Please check your connection',
        );
      }
    } else {
      setIsLoading(false);
    }
  }, [selectedTimezone]);

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
