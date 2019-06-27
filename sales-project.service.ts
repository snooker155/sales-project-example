import { environment } from '../../../../environments/environment';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { SalesProjectHelperService } from './sales-project-helper.service';
import { ISalesProjectWrapper } from './sales-project-wrapper.interface';
import { SalesProjectWrapper } from './sales-project-wrapper.model';
import { ISalesProject } from './sales-project.interface';
import { SalesProject } from './sales-project.model';

import { CacheService, CacheType } from '../cache';
import { AbstractRestApiService } from '../common/abstract-rest-api.service';
import { ICollectionRequestParams } from '../common/collection-request-params.interface';
import { postHeaders } from '../common/request-headers';
import { SalesProjectPDFDocumentType } from '../common/sales-project-pdf-document-type.enum';
import { QueryParamsService } from '../query-params';

const CACHE_TYPE_INSTANCE = CacheType.SALES_PROJECT;
const CACHE_TYPE_WRAPPER = CacheType.SALES_PROJECT_WRAPPER;

@Injectable({
  providedIn: 'root'
})

/**
 * @class SalesProjectService
 * Represents a service to load SalesProject data from the backend
 * and manage caching of loaded resources.
 */
export default class SalesProjectService extends AbstractRestApiService {

  /**
   * @constructs SalesProjectService
   */
  constructor(
    protected http: HttpClient,
    protected cacheService: CacheService,
    private salesProjectHelperService: SalesProjectHelperService
  ) {
    super(http, cacheService);
  }

  /**
   * Sets defaults to a single SalesProject instance.
   * @param observable$ An Observable SalesProject
   */
  private _setDefaults(observable$: Observable<SalesProject>): Observable<SalesProject> {
    observable$.forEach(salesProject => {
      if (salesProject) {
        this.salesProjectHelperService.setDefaults(salesProject);
      }
    });

    return observable$;
  }

  /**
   * Sets defaults to a single SalesProjectWrapper instance.
   * @param observable$ An Observable SalesProjectWrapper
   */
  private _setWrapperDefaults(observable$: Observable<SalesProjectWrapper>): Observable<SalesProjectWrapper> {
    observable$.forEach(salesProjectWrapper => {
      if (salesProjectWrapper) {
        salesProjectWrapper.items.forEach(salesProject => {
          this.salesProjectHelperService.setDefaults(salesProject);
        });
      }
    });

    return observable$;
  }

  // --------------- GET Multiple Instances ---------------

  /**
   * Loads a list of sales projects from the backend.
   * @param params Optional request parameters
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  getSalesProjects(
    params: ICollectionRequestParams = {},
    ignoreCache: boolean = false,
    useCache: boolean = true
  ): Observable<SalesProjectWrapper> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.list}`;
    const query = QueryParamsService.serializeParams(params);
    const url = query.length > 0 ? `${SERVICE_URL}?${query}` : SERVICE_URL;
    const observable$ = this.http.get<ISalesProjectWrapper>(url);
    const responseObservable$ = this._request(observable$, SalesProjectWrapper.fromJSON, CACHE_TYPE_WRAPPER, ignoreCache, useCache, url) as Observable<SalesProjectWrapper>;
    return this._setWrapperDefaults(responseObservable$);
  }

  /**
   * Loads a specific sales project by a given Lead's number identifier from the backend.
   * @param leadNumber A Lead's number identifier
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  getSalesProjectsByLeadNumber(
    leadNumber: number,
    ignoreCache: boolean = false,
    useCache: boolean = true
  ): Observable<SalesProjectWrapper> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.findByLeadNumber}`;
    const url = SERVICE_URL.replace(':leadNumber', leadNumber.toString());
    const observable$ = this.http.get<ISalesProjectWrapper>(url);
    const responseObservable$ = this._request(observable$, SalesProjectWrapper.fromJSON, CACHE_TYPE_WRAPPER, ignoreCache, useCache, url) as Observable<SalesProjectWrapper>;
    return this._setWrapperDefaults(responseObservable$);
  }

  /**
   * Loads a specific sales project by a given LeadOffer's identifier from the backend.
   * @param offerId A LeadOffer's identifier
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  getSalesProjectsByOfferId(
    offerId: string,
    ignoreCache: boolean = false,
    useCache: boolean = true
  ): Observable<SalesProjectWrapper> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.findByOfferId}`;
    const url = SERVICE_URL.replace(':offerId', offerId);
    const observable$ = this.http.get<ISalesProjectWrapper>(url);
    const responseObservable$ = this._request(observable$, SalesProjectWrapper.fromJSON, CACHE_TYPE_WRAPPER, ignoreCache, useCache, url) as Observable<SalesProjectWrapper>;
    return this._setWrapperDefaults(responseObservable$);
  }

  /**
   * Loads a specific sales project by a given name from the backend.
   * @param projectName A salesProject's name
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  getSalesProjectsByProjectName(
    projectName: string,
    ignoreCache: boolean = false,
    useCache: boolean = true
  ): Observable<SalesProjectWrapper> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.findByProjectName}`;
    const url = SERVICE_URL.replace(':projectName', projectName);
    const observable$ = this.http.get<ISalesProjectWrapper>(url);
    const responseObservable$ = this._request(observable$, SalesProjectWrapper.fromJSON, CACHE_TYPE_WRAPPER, ignoreCache, useCache, url) as Observable<SalesProjectWrapper>;
    return this._setWrapperDefaults(responseObservable$);
  }

  /**
   * Loads a specific sales project by a given Salesman's number identifier from the backend.
   * @param salesmanNumber A Salesman's number identifier
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  getSalesProjectsBySalesmanNumber(
    salesmanNumber: number,
    ignoreCache: boolean = false,
    useCache: boolean = true
  ): Observable<SalesProjectWrapper> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.findBySalesmanNumber}`;
    const url = SERVICE_URL.replace(':salesmanNumber', salesmanNumber.toString());
    const observable$ = this.http.get<ISalesProjectWrapper>(url);
    const responseObservable$ = this._request(observable$, SalesProjectWrapper.fromJSON, CACHE_TYPE_WRAPPER, ignoreCache, useCache, url) as Observable<SalesProjectWrapper>;
    return this._setWrapperDefaults(responseObservable$);
  }

  /**
   * Loads a list of lead offers from the backend, filtered by a given search term.
   * @param term A search term
   * @param params Optional request parameters
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  search(
    term: string,
    params: ICollectionRequestParams = {},
    ignoreCache: boolean = true,
    useCache: boolean = false
  ): Observable<SalesProjectWrapper> {
    // @TODO: API does not exist in the backend, yet!!!
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.search}`;
    const query = QueryParamsService.serializeParams(params);
    const url = query.length > 0 ? `${SERVICE_URL}?${query}&term=${term}` : `${SERVICE_URL}?term=${term}`;
    const observable$ = this.http.get<ISalesProjectWrapper>(url);
    const responseObservable$ = this._request(observable$, SalesProjectWrapper.fromJSON, CACHE_TYPE_WRAPPER, ignoreCache, useCache, url) as Observable<SalesProjectWrapper>;
    return this._setWrapperDefaults(responseObservable$);
  }

  // --------------- GET, POST, PUT, DELETE Single Instance ---------------

  /**
   * Deletes a SalesProject from the backend.
   * @param salesProjectId A SalesProject's identifier
   */
  deleteSalesProject(salesProjectId: string): Observable<boolean> {
    const subject$: Subject<any> = new BehaviorSubject(null);
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.delete}`;
    const url = SERVICE_URL.replace(':id', salesProjectId);
    const observable$ = this.http.delete<ISalesProject>(url);
    const subscription$ = observable$.subscribe(
      () => this._onSuccess(true, subject$, subscription$),
      (err: HttpErrorResponse) => this._onError(err, subject$, subscription$)
    );

    return subject$;
  }

  /**
   * Loads a specific SalesProject by a given identifier from the backend.
   * @param projectId A SalesProject's identifier
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  getSalesProjectById(
    projectId: string,
    ignoreCache: boolean = false,
    useCache: boolean = true
  ): Observable<SalesProject> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.byId}`;
    const url = SERVICE_URL.replace(':id', projectId);
    const observable$ = this.http.get<ISalesProject>(url);
    const responseObservable$ = this._request(observable$, SalesProject.fromJSON, CACHE_TYPE_INSTANCE, ignoreCache, useCache, url) as Observable<SalesProject>;
    return this._setDefaults(responseObservable$);
  }

  /**
   * Posts a new SalesProject to the backend.
   * @param salesProject A SalesProject instance
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  postSalesProject(
    salesProject: SalesProject,
    ignoreCache: boolean = true,
    useCache: boolean = false
  ): Observable<SalesProject> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.post}`;
    const observable$ = this.http.post<ISalesProject>(SERVICE_URL, JSON.stringify(salesProject.toJSON()), {
      headers: postHeaders
    });
    const responseObservable$ = this._request(observable$, SalesProject.fromJSON, CACHE_TYPE_INSTANCE, ignoreCache, useCache, SERVICE_URL) as Observable<SalesProject>;
    return this._setDefaults(responseObservable$);
  }

  /**
   * Puts a SalesProject to the backend.
   * @param salesProject A SalesProject instance
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  putSalesProject(
    salesProject: SalesProject,
    ignoreCache: boolean = true,
    useCache: boolean = false
  ): Observable<SalesProject> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.put}`;
    const url = SERVICE_URL.replace(':id', salesProject.id);
    const observable$ = this.http.put<ISalesProject>(url, JSON.stringify(salesProject.toJSON()), {
      headers: postHeaders
    });
    const responseObservable$ = this._request(observable$, SalesProject.fromJSON, CACHE_TYPE_INSTANCE, ignoreCache, useCache, url) as Observable<SalesProject>;
    return this._setDefaults(responseObservable$);
  }

  // --------------- Functional API ---------------

  /**
   * Generates a SalesProjects's PDF document in the backend.
   * @param salesProject A SalesProject instance
   * @param documentType A SalesProject's document identifier
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  generatePDF(
    salesProject: SalesProject,
    documentType: SalesProjectPDFDocumentType,
    ignoreCache: boolean = true,
    useCache: boolean = true
  ): Observable<SalesProject> {
    let SERVICE_URL: string;

    switch (documentType) {
      case SalesProjectPDFDocumentType.API_PDF_FORM:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateApiPDFForm}`;
        break;
      case SalesProjectPDFDocumentType.FRAME_CONTRACT:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateFrameContractPDF}`;
        break;
      case SalesProjectPDFDocumentType.FRAME_CONTRACT_1:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateFrameContract1PDF}`;
        break;
      case SalesProjectPDFDocumentType.FRAME_CONTRACT_2:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateFrameContract2PDF}`;
        break;
      case SalesProjectPDFDocumentType.FRAME_CONTRACT_3:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateFrameContract3PDF}`;
        break;
      case SalesProjectPDFDocumentType.IP_VPN_PDF_FORM:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateIPVPNPDFForm}`;
        break;
      case SalesProjectPDFDocumentType.PORTAL_PDF_FORM:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generatePortalPDFForm}`;
        break;
      case SalesProjectPDFDocumentType.ROUTING_SHEET:
        SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateRoutingSheetPDF}`;
        break;
      default:
        break;
    }

    const url = SERVICE_URL.replace(':salesProjectNumber', salesProject.salesProjectNumber.toString());
    const observable$ = this.http.get<ISalesProject>(url);
    return this._request(observable$, SalesProject.fromJSON, CACHE_TYPE_INSTANCE, ignoreCache, useCache, url) as Observable<SalesProject>;
  }

  /**
   * Generates a SalesProjects's routing sheet PDF in the backend.
   * @param salesProject A SalesProject instance
   * @param offerId A LeadOffer's identifier
   * @param ignoreCache Whether to ignore the cache or not
   * @param useCache Whether to fill the cache with the response or not
   */
  generateRoutingSheetJSON(
    salesProject: SalesProject,
    offerId: string,
    ignoreCache: boolean = true,
    useCache: boolean = true
  ): Observable<SalesProject> {
    const SERVICE_URL = `${environment.apiGatewayUrl}${environment.offerGeneratorServiceAPI.salesProjects.generateRoutingSheetJSON}`;
    const url = SERVICE_URL
      .replace(':salesProjectNumber', salesProject.salesProjectNumber.toString())
      .replace(':offerId', offerId);
    const observable$ = this.http.get<ISalesProject>(url);
    return this._request(observable$, SalesProject.fromJSON, CACHE_TYPE_INSTANCE, ignoreCache, useCache, url) as Observable<SalesProject>;
  }
}
