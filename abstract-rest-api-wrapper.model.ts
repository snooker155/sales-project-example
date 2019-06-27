import { AbstractRestApiModel } from './abstract-rest-api.model';
import { IPage } from './page.interface';
import { Page } from './page.model';


/**
 * @class AbstractRestApiWrapper
 * Represents an abstract wrapper data model.
 */
export abstract class AbstractRestApiWrapper<T extends AbstractRestApiModel> extends AbstractRestApiModel {
  items: T[];
  page?: Page;

  constructor() {
    super();
  }

  /**
   * Returns a wrapper instance created with data from a given JSON structure.
   * @param wrapperCtor A wrapper's constructor
   * @param itemCtor A wrapped item's constructor
   * @param json A JSON structure
   * @param prop A property's name indicating the path to <code>json._embedded.prop</code> containing item data
   */
  protected static _wrapperFromJSON<I>(wrapperCtor: any, itemCtor: any, json: I[], page?: IPage) {
    const wrapper = new wrapperCtor();

    try {
      const items = [];

      if (json) {
        json.forEach(jsonInstance => {
          const item = itemCtor.fromJSON(jsonInstance);

          if (item) {
            items.push(item);
          }
        });
      }

      wrapper.items = items;
      wrapper.page = page ? Page.fromJSON(page) : null;
    } catch (error) {
      console.warn('error parsing json', error, wrapperCtor, itemCtor, json, page);
    }

    return wrapper;
  }

  /**
   * Returns a wrapper's serialized JSON object.
   *
   * IMPORTANT: the return value does not (!) conform
   * to the data structure in the backend!
   */
  toJSON(): object {
    const items = this.items.map(
      item => item.toJSON()
    );
    const result = { items };

    if (this.page) {
      return Object.assign(result, {
        page: this.page.toJSON()
      });
    }

    return result;
  }

  /**
   * Returns a single item instance or <i>null</i> if the
   * wrapper does not contain any item instances.
   */
  get firstItem(): T | null {
    // if (this.items.length === 1) {
    if (this.items.length > 0) {
      return this.items[0];
    }

    return null;
  }
}
