import { ISalesProject } from './sales-project.interface';
import { RestApiHelper } from './rest-api-helper';
import { AbstractRestApiModel } from './abstract-rest-api.model';


/**
 * @class SalesProject
 * @classdesc Represents the SalesProject data model.
 */
export default class SalesProject extends AbstractRestApiModel {

  /** Represents a SalesProject's created date. */
  readonly createdDate: Date;
  /** Represents a SalesProject's order date. */
  readonly dateOrdered: Date;
  /** Represents a SalesProject's identifier */
  readonly id: string;
  /** Represents a SalesProject's last modified date. */
  readonly lastModifiedDate: Date;
  /** Represents a SalesProject's related Lead's number identifier. */
  leadNumber: number;
  /** Represents a SalesProject's related LeadOffer identifiers. */
  offerIds: string[] = [];
  /** Represents a SalesProject's order responsible. */
  readonly orderedBy: string;
  /** Represents a SalesProject's ordered LeadOffer identifier. */
  readonly orderedOfferId: string;
  /** Represents a SalesProject's project name. */
  projectName: string;
  /** Represents a SalesProject's related Salesman's number identifier. */
  salesmanNumber: number;
  /** Represents a SalesProject's number identifier. */
  readonly salesProjectNumber: number;

  /**
   * @constructs SalesProject
   */
  constructor(
    id: string = null,
    createdDate: Date = null,
    dateOrdered: Date = null,
    lastModifiedDate: Date = null,
    orderedBy: string = null,
    orderedOfferId: string = null,
    salesProjectNumber: number = null
  ) {
    super();
    
    this.createdDate = createdDate;
    this.dateOrdered = dateOrdered;
    this.id = id;
    this.lastModifiedDate = lastModifiedDate;
    this.orderedBy = orderedBy;
    this.orderedOfferId = orderedOfferId;
    this.salesProjectNumber = salesProjectNumber;

    this.projectName = '';
  }

  // --------------- Overwrite Static (AbstractRestApiModel) ---------------

  /**
   * Converts a raw JSON object to a SalesProject instance.
   * @param json A JSON object
   */
  public static fromJSON(json: ISalesProject): SalesProject {

    const instance = new SalesProject(
      json.id,
      RestApiHelper.convertStringToDate(json.createdDate),
      RestApiHelper.convertStringToDate(json.dateOrdered),
      RestApiHelper.convertStringToDate(json.lastModifiedDate),
      json.orderedBy,
      json.orderedOfferId,
      json.salesProjectNumber
    );

    try {
      instance.leadNumber = json.leadNumber,
      instance.offerIds = json.offerIds;
      instance.projectName = json.projectName;
      instance.salesmanNumber = json.salesmanNumber;
    } catch (error) {
      // console.warn('error parsing SalesProject', error);
    }

    return instance;
  }

  // --------------- Overwrite Public (AbstractRestApiModel) ---------------

  /**
   * Returns a serialized SalesProject instance.
   *
   * IMPORTANT: documentInfo must not get serialized and sent to the backend
   * because it should not be persisted in the database!!!
   */
  toJSON(): object {
    return Object.assign({}, {
      createdDate: RestApiHelper.convertDateToString(this.createdDate),
      dateOrdered: RestApiHelper.convertDateToString(this.dateOrdered),
      id: this.id,
      lastModifiedDate: RestApiHelper.convertDateToString(this.lastModifiedDate),
      leadNumber: this.leadNumber,
      offerIds: this.offerIds,
      orderedBy: this.orderedBy,
      orderedOfferId: this.orderedOfferId,
      projectName: this.projectName,
      salesmanNumber: this.salesmanNumber,
      salesProjectNumber: this.salesProjectNumber,
    });
  }

  // --------------- Public ---------------

  /**
   * Clones a SalesProject instance.
   */
  clone(): SalesProject {
    const json = this.toJSON() as ISalesProject;
    return SalesProject.fromJSON(json);
  }

  /**
   * Returns whether a LeadOffer is related to a SalesProject or not.
   * @param offerId A LeadOffer's identifier
   */
  containsOfferById(offerId: string): boolean {
    return this.offerIds.includes(offerId);
  }
}
