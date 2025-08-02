/**
 * This is a tagging interface to indicate that an object can be deserialized from JSON.
 * in order to do this, you must create a static method called `fromJSON` that takes a JSON string and any neccessary to enforce proper typing
 *  and returns an instance of the class.
 * 
 * There is no way to technically enforce this in TypeScript, so we rely on your implementation.
 * 
 */
export interface Deserializable {
	//static fromJSON<T extends JavaObject>(json: string, ops?: object): this;
}