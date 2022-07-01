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
    type Response = TimezoneListResponse[];
    const { data: availableTimezoneList } = await axios.get<Response>(
      this.baseWorldTimeApiUrl,
    );

    return availableTimezoneList;
  }

  async fetchTimeInfoFromTimezone(timezone: string) {
    type Response = TimezoneResponse | TimezoneError;
    const { data: timezoneInfo } = await axios.get<Response>(
      `${this.baseWorldTimeApiUrl}/${timezone}`,
    );

    return timezoneInfo;
  }
}
