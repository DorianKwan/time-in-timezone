// eslint & prettier were fighting over formatting; will fix later
/* eslint-disable @typescript-eslint/indent */
import axios from 'axios';
import {
  TimezoneError,
  TimezoneListResponse,
  TimezoneResponse,
} from './wt-utils';

export default class WorldTimeApiRepo {
  constructor(
    readonly baseWorldTimeApiUrl = 'http://worldtimeapi.org/api/timezone',
  ) {}

  async fetchAvailableTimezones() {
    const { data: availableTimezoneList } = await axios.get<
      TimezoneListResponse[]
    >(this.baseWorldTimeApiUrl);

    return availableTimezoneList;
  }

  async fetchTimeInfoFromTimezone(timezone: string) {
    const { data: timezoneInfo } = await axios.get<
      TimezoneResponse | TimezoneError
    >(`${this.baseWorldTimeApiUrl}/${timezone}`);

    return timezoneInfo;
  }
}
