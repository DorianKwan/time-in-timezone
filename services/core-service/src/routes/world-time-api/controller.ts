import {
  addRoutesToRouter,
  bodyparser,
  HttpMethod,
  Router,
  route,
  SchemaBuilder,
  err,
} from '@lcdev/router';
import WorldTimeApiService, { WorldTimeApiServiceError } from './service';

export default (worldTimeApiService: WorldTimeApiService) => {
  const router = new Router();

  router.use(bodyparser());

  return addRoutesToRouter(router, [
    route({
      path: '/timezones',
      method: HttpMethod.GET,
      async action() {
        try {
          const availableTimezoneOptions =
            await worldTimeApiService.getAvailableTimezoneOptions();

          return availableTimezoneOptions;
        } catch (error: any) {
          switch (error.type) {
            default:
              throw error;
          }
        }
      },
    }),
    route({
      path: '/timezone-time',
      method: HttpMethod.GET,
      querySchema: SchemaBuilder.emptySchema().addString('timezone', {
        minLength: 3,
      }),
      async action(ctx, _, { timezone }) {
        try {
          const timeInTimezone =
            await worldTimeApiService.getCurrentTimeInTimezone(timezone);

          return timeInTimezone;
        } catch (error: any) {
          switch (error.type) {
            case WorldTimeApiServiceError.TimezoneNotFound:
              throw err(404, error.message).withData(error.data);
            default:
              throw error;
          }
        }
      },
    }),
  ]);
};
