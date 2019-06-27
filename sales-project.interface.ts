/**
 * @interface ISalesProject
 * Represents an interface for the sales project data model
 * in the backend.
 */
export interface ISalesProject {
    createdDate: string;
    dateOrdered: string;
    id: string;
    lastModifiedDate: string;
    leadNumber: number;
    offerIds: string[];
    orderedBy: string;
    orderedOfferId: string;
    projectName: string;
    salesmanNumber: number;
    salesProjectNumber: number;
  }