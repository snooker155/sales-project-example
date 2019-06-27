import { Subscription } from 'rxjs';

/**
 * Represents a class providing static helper methods for use
 * with the backend communication.
 * @class RestApiHelper
 */
export default class RestApiHelper {

  /**
   * Cancels a Subscription.
   * @param subscription$ A Subscription instance
   */
  public static cancelSubscription(subscription$: Subscription): void {
    if (subscription$) {
      subscription$.unsubscribe();
    }
  }

  /**
   * Converts a given Date to a String with format <pre>'yyyy-mm-dd'</pre>.
   * This method should be used when converting a JavaScript Date object
   * to a short date String to be sent to the backend or to be used in
   * the client URLs parameters.
   * @param date A Date
   */
  public static convertDateToRequestParam(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }

  /**
   * Converts a given date String with format <pre>'yyyy-mm-dd'</pre> to a Date object.
   * This method should be used when converting a short date String from
   * the client's URLs parameters to a JavaScript Date object.
   * @param dateStr A date with format <pre>'yyyy-mm-dd'</pre>
   */
  public static convertRequestParamToDate(dateStr: string): Date {
    return new Date(`${dateStr}T00:00:00.000+0100`);
  }

  /**
   * Converts a given date String to a Date object.
   * This method should be used when converting a date String
   * from the backend into a JavaScript Date object.
   * @param dateStr A date string
   */
  public static convertStringToDate(dateStr: string): Date {
    // console.warn('#convertStringToDate', dateStr, (typeof dateStr === 'string'));
    const date = (typeof dateStr === 'string') ? new Date(dateStr.replace('+0000', 'Z')) : null;
    return (date instanceof Date && !isNaN(date.valueOf())) ? date : new Date(0);
  }

  /**
   * Converts a given Date to a date String.
   * This method should be used when converting a JavaScript Date object
   * to a date String to be sent to the backend.
   * @param date A Date instance
   */
  public static convertDateToString(date: Date): string {
    return date ? date.toISOString().replace('Z', '+0000') : null;
  }
}
