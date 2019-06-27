import { IPage } from './page.interface';

/**
 * @interface IRestApiWrapper
 * Represents an interface for the generic wrapper data model in the backend.
 */
export interface IRestApiWrapper<T> {
  _embedded: {[key: string]: T[]};
  page?: IPage;
}
