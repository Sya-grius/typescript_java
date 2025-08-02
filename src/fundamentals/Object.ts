/**
 * Java's Object class.
 * Mimics the behavior of Java's Object class in JavaScript.
 */
export abstract class JavaObject extends Object {
  #hash: number;
  /**
   * Constructor for JavaObject.
   * Initializes a unique hash code for the object.
   * This is a simple implementation and does not guarantee uniqueness across all instances.
   */
  constructor() {
    super();
    this.#hash = Math.floor(Math.random() * 0x7fffffff);
  }
  public toString(): string {
    return this.constructor.name + "@" + Math.random().toString(16);
  }

  /**
   * determines if this object is equal to another object.
   *
   * NOTE: if you see this, that means the object you are working with has not overridden the `equals` method,
   * and could very likely be a problem
   * @param other
   * @returns
   */
  public equals(other: any): boolean {
    return boilerplateEqualityCheck({ obj1: this, obj2: other });
  }

  /**
   * in Java, the hashcode is an identifier for the pointer of the object in memory,
   * we have no such thing in JavaScript, so we use a random number in the range of a signed 32-bit integer.
   *
   * in essence, this is completely useless outside of the context of this library, and even within it it is merely a quick
   * property to check for "equality" of two objects that may have been deep copied, or any other number of ways
   * that JavaScript tomfoolery can leak in.
   * @returns
   */
  public hashCode(): number {
    return this.#hash;
  }

}

/**
 * this is simply a helper method to define a "base" equals method for class overrides. It is difficult to navigate
 * the many problems with Javascript and keeping them in mind while in "Java mode" can be unduely arduous, so this is provided
 * as a boilerplate method in doing so.
 * @param obj1 the first object to compare
 * @param obj2 the second object to compare
 * @param callback an optional callback that can be used to provide custom equality logic
 * @returns `true` if the objects are "equal", `false` otherwise
 */
export function boilerplateEqualityCheck<T extends JavaObject>({ obj1, obj2 }: { obj1: JavaObject; obj2: any }, callback?: (o1: T, o2: T) => boolean): boolean {
  if (obj1 === obj2) {
    return obj2;
  }
  if (obj2 === null || obj2 === undefined) {
    return false;
  }
  // this is pretty much as close as we can get to Java's `this.getClass() == obj2.getClass()` check.
  // The results can still be faked because #JavaScriptIsAnAcidTrip
  // Example:
  /*
		  const Fake = {constructor: "JavaObject", hashCode: () => 12345};
		  Object.setPrototypeOf(Fake, JavaObject.prototype);
		 */
  if (typeof obj2 !== "object" || !obj2.constructor || !(obj2 instanceof JavaObject) || obj2.constructor.name !== obj1.constructor.name) {
    return false;
  }
  if (obj1.hashCode() === obj2.hashCode()) {
    return callback ? callback(obj1 as T, obj2 as T) : true; // if a callback is provided, use it to determine equality
  }
  return false;
}
