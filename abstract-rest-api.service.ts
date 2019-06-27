import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

// import { CacheService } from '../cache';
import { AbstractRestApiModel } from './abstract-rest-api.model';
import { RestApiHelper } from './rest-api-helper';
// import { IRestApiWrapper } from './rest-api-wrapper.interface';

/**
 * @class AbstractRestApiService
 * Represents an abstract service to load data from the backend
 * and manage caching of loaded resources.
 */
export abstract class AbstractRestApiService {

  /**
   * @constructs AbstractRestApiService
   */
  constructor(
    protected http: HttpClient,
    // protected cacheService: CacheService,
  ) {}

  /**
   * Handles Http success.
   * @param response A Http response
   * @param subject$ An AbstractRestApiModel subject
   * @param subscription$ A Subscription instance
   */
  protected _onSuccess(
    response: any,
    subject$: Subject<AbstractRestApiModel>,
    subscription$: Subscription
  ): void {
    RestApiHelper.cancelSubscription(subscription$);
    subject$.next(response);
    subject$.complete();
}

  /**
   * Handles Http errors.
   * @param err An HttpErrorResponse instance
   * @param subject$ An AbstractRestApiModel subject
   * @param subscription$ A Subscription instance
   */
  protected _onError(
    err: HttpErrorResponse,
    subject$: Subject<AbstractRestApiModel>,
    subscription$: Subscription
  ): void {
    if (err.error instanceof Error) {
      console.log('An error occurred:', err.error.message);
    } else {
      console.log(`Backend returned code ${err.status}, body was: ${JSON.stringify(err.error, null, 2)}`);
    }

    RestApiHelper.cancelSubscription(subscription$);
    subject$.error(err);
    subject$.complete();
  }

  /**
   * Loads a single instance of a specific class from the backend
   * or returns cached data if appropriate.
   * @param observable$ An Observable IRestInstance
   * @param parseFunc A callback for parsing the requested JSON
   * @param cacheType The cache's type
   * @param ignoreCache Whether to ignore the cache or not. Defaults to <code>false</code>.
   * @param useCache Whether to fill the cache with the response or not. Defaults to <code>true</code>.
   * @param requestUrl An optional request url. Defaults to <code>null</code>.
   */
  protected _request(
    observable$: Observable<any>,
    parseFunc: Function,
    cacheType: string,
    ignoreCache: boolean = false,
    useCache: boolean = true,
    requestUrl: string = null
  ): Observable<AbstractRestApiModel> {
    const subject$: Subject<AbstractRestApiModel> = new BehaviorSubject(null);

    // if (!ignoreCache && this.cacheService.isValid(cacheType, requestUrl)) {
    //   const instance = this.cacheService.getCacheContentOfType(cacheType);

    //   window.setTimeout(() => {
    //     subject$.next(instance);
    //     subject$.complete();
    //   }, 0);
    // } else {
      const subscription$ = observable$.subscribe(
        response => {
          const instance = parseFunc(response);

        //   if (useCache) {
        //     this.cacheService.registerCache(cacheType, instance, requestUrl);
        //   }

          this._onSuccess(instance, subject$, subscription$);
        },
        (err: HttpErrorResponse) => this._onError(err, subject$, subscription$)
      );
    // }

    return subject$;
  }
}
