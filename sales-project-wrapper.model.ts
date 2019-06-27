import { ISalesProjectWrapper } from './sales-project-wrapper.interface';
import { SalesProject } from './sales-project.model';

import { AbstractRestApiWrapper } from './abstract-rest-api-wrapper.model';

/**
 * @class SalesProjectWrapper
 * Represents the sales projects wrapper data model.
 */
export class SalesProjectWrapper extends AbstractRestApiWrapper<SalesProject> {

  /**
   * Converts a raw JSON object to a SalesProjectWrapper instance.
   * @param json A JSON object
   */
  public static fromJSON(json: ISalesProjectWrapper): SalesProjectWrapper {
    return AbstractRestApiWrapper._wrapperFromJSON(
      SalesProjectWrapper,
      SalesProject,
      json._embedded.salesProjects,
      json.page
    );
  }
}
