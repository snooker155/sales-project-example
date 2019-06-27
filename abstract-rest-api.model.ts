
/**
 * @class AbstractRestApiModel
 * @classdesc Represents an abstract class declaring
 * methods for parsing from and to JSON.
 */
export abstract class AbstractRestApiModel {

    // --------------- Public Static ---------------
  
    /**
     * Converts a raw JSON object to an AbstractRestApiModel instance.
     * @param json A JSON object
     */
    public static fromJSON(json: object | object[]): any {}
  
    // --------------- Public Accessors ---------------
  
    /**
     * Returns a serialized JSON collection from a collection of AbstractRestApiModel instances.
     * @param collection A collection of AbstractRestApiModel instances
     */
    collectionToJSON<T extends AbstractRestApiModel>(collection: T[]) {
      return collection.map(
        instance => instance.toJSON()
      );
    }
  
    /**
     * Returns a serialized AbstractRestApiModel instance.
     */
    abstract toJSON(): object;
  
    /**
     * Returns a string representation of an AbstractRestApiModel instance.
     * @param space An optional String or Number object that's used to insert white space into the output JSON string for readability purposes
     */
    toString(space: number = null): string {
      return JSON.stringify(this.toJSON(), null, space);
    }
  }
  