import { AxiosResponse } from 'axios';
import { loadConfig } from 'src/utils/load-config';
import { ApiData } from 'time-in-timezone-shared';
import { createBaseApi } from './base-api';

const { webServerUrl, webServerPort } = loadConfig();
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

const createApi = (baseUrl: string) => {
  const coreServiceApi = createBaseApi(baseUrl);

  return {
    timeInTimezone: {
      async getTimezoneOptions() {
        type Response = AxiosResponse<ApiResponse<ApiData.TimezoneOptions>>;

        const response = await coreServiceApi.get<Response>(
          '/world-time-api/timezones',
        );

        if (response.status !== 200) throw new Error(response.statusText);

        const { data } = response.data;

        return data;
      },
    },
  };
};

export const coreServiceApi = createApi(
  `http://${webServerUrl}:${webServerPort}`,
);
