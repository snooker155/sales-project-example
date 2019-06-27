import { IRestApiWrapper } from './abstract-rest-api-wrapper.interface';
import { ISalesProject } from './sales-project.interface';

/**
 * @interface ISalesProjectWrapper
 * Represents an interface for the sales project wrapper data model
 * in the backend.
 */
export interface ISalesProjectWrapper extends IRestApiWrapper<ISalesProject> {}