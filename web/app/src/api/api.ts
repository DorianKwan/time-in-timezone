import { loadConfig } from 'src/utils/load-config';
import { createBaseApi } from './base-api';

const { webServerUrl, webServerPort } = loadConfig();
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

const createApi = (baseUrl: string) => {
  const coreServiceApi = createBaseApi(baseUrl);

  return {
    timeInTimezone: {},
  };
};

export const coreServiceApi = createApi(
  `http://${webServerUrl}:${webServerPort}`,
);
