import { ServiceError } from '../../utils';
import WorldTimeApiRepo from './repo';
import { isErrorResponse } from './wt-utils';

export default class WorldTimeApiService {
  constructor(private readonly worldTimeApiRepo: WorldTimeApiRepo) {}

  async getAvailableTimezoneOptions() {
    const availableTimezoneOptions =
      await this.worldTimeApiRepo.fetchAvailableTimezones();

    return availableTimezoneOptions;
  }

  async getCurrentTimeInTimezone(timezone: string) {
    const timezoneInfo = await this.worldTimeApiRepo.fetchTimeInfoFromTimezone(
      timezone,
    );

    if (isErrorResponse(timezoneInfo)) {
      throw new ServiceError({
        type: WorldTimeApiServiceError.TimezoneNotFound,
        message: 'Timezone does not exist',
        data: { timezone, errorMessage: timezoneInfo.error },
      });
    }

    const { datetime } = timezoneInfo;

    return { datetime };
  }
}

export enum WorldTimeApiServiceError {
  TimezoneNotFound = 'world-time-api/timezone-not-found',
}
