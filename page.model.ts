import { AbstractRestApiModel } from './abstract-rest-api.model';
import { IPage } from './page.interface';

/**
 * @class Page
 * Represents a Page model containing information for paging.
 */
export class Page extends AbstractRestApiModel implements IPage {
  /**
   * Returns the number of elemen on the current page.
   */
  readonly size: number;

  /**
   * Returns the total number of elements available
   */
  readonly totalElements: number;

  /**
   * Returns the total number of pages available
   */
  readonly totalPages: number;

  /**
   * Returns the current page number.
   */
  readonly number: number;

  /**
   * @constructs Page
   * @param size The number of elements on the current page
   * @param totalElements The total number of elements available
   * @param totalPages The total number of pages available
   * @param number The current page number
   */
  constructor(
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  ) {
    super();

    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.number = number;
  }

  /**
   * Converts a raw JSON object to a Page instance.
   * @param json A JSON object
   */
  public static fromJSON(json: IPage): Page {
    return new Page(
      json.size,
      json.totalElements,
      json.totalPages,
      json.number
    );
  }

  /**
   * Returns a serialized Page instance.
   */
  toJSON(): object {
    return {
      size: this.size,
      totalElements: this.totalElements,
      totalPages: this.totalPages,
      number: this.number
    };
  }
}
