export interface TimezoneResponse {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: string;
  dst_from: string | null;
  dst_offset: number;
  dst_until: string | null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
}

export interface TimezoneError {
  error: string;
}

export type TimezoneListResponse = string[];

export const isErrorResponse = (
  response: TimezoneError | TimezoneResponse,
): response is TimezoneError => {
  return !(response as TimezoneError).error;
};
