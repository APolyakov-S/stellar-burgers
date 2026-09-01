import type { Location } from 'react-router-dom';

/** Данные, которые кладутся в location.state при навигации
 * (модальные окна и защищённые маршруты) */
export type TLocationState = {
  background?: Location;
  from?: Location;
};
