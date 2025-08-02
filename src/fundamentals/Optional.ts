import { boilerplateEqualityCheck, JavaObject } from "./Object";

export class Optional<T> extends JavaObject {
  #value: T | null;

  /**
   *
   * @param value your value!
   */
  constructor(value: T | null | undefined, internalArgs?: { nullable: boolean; mssg?: string }) {
    super();
    if (value === undefined) {
      console.warn("undefined value passed to Optional, treating it as null");
      value = null; // Java does not have a concept of "undefined" in the same way JavaScript does, so we treat it as null.
    }
    !internalArgs &&
      console.error(
        "you should not use this constructor directly, JavaScript demands for it to exist, but to properly mimic Java, please use `Optional.of(value)` or `Optional.ofNullable(value)` instead"
      );
    if (value === null && !internalArgs?.nullable) {
      throw new Error(internalArgs?.mssg ? internalArgs.mssg : "Value cannot be null.");
    }
    this.#value = value;
  }

  /**
   * Constructs an Optional with a non-null value.
   * @param value
   * @returns
   */
  public static of<T>(value: T): Optional<T> {
    return new Optional<T>(value, { nullable: false });
  }

  /**
   * Constructs an Optional that can be null.
   * @param value
   * @returns
   */
  public static ofNullable<T>(value: T | null): Optional<T> {
    return new Optional<T>(value, { nullable: true });
  }

  /**
   * Constructs an Optional that requires a non-null value.
   * Throws an error if the value is null.
   * This is similar to `Optional.of(value)` but allows for a custom message.
   * @param value
   * @param mssg
   * @returns
   */
  public static requireNonNull(value: any | null, mssg?: string): Optional<typeof value> {
    return new Optional<typeof value>(value, { nullable: false, mssg });
  }

  /**
   * uses the callback provided if the value is present.
   * @param callback
   */
  public ifPresent(consumer: (value: T) => void): void {
    if (this.#value !== null) {
      consumer(this.#value!);
    }
  }

  /**
   * executes the provided consumer if the value is present, otherwise executes the other function.
   * @param consumer
   * @param other
   */
  public ifPresentOrElse(consumer: (value: T) => void, other: () => void): void {
    if (this.#value !== null) {
      consumer(this.#value as T);
    } else {
      other();
    }
  }

  /**
   * used to convert the internal optional value to a different type
   * @param mapper
   */
  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.#value === null) {
      return Optional.ofNullable<U>(null);
    }
    return Optional.of(mapper(this.#value));
  }

  /**
   * used to convert the internal optional value to a different type,
   * however, if it produces another Optional, it will flatten/unwrap it it.
   * @param mapper
   */
  public flatMap<U>(mapper: (value: T) => Optional<U | Optional<U>>): Optional<U> {
    if (this.#value === null) {
      return Optional.ofNullable<U>(null);
    }
    const firstLayer = mapper(this.#value!);
    if (firstLayer && firstLayer instanceof Optional && firstLayer.get() instanceof Optional) {
      return firstLayer.get() as Optional<U>;
    } else {
      return firstLayer as Optional<U>;
    }
  }

  /**
   * determines if the value is present and matches the predicate.
   * @param predicate
   */
  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (this.#value === null || !predicate(this.#value as T)) {
      return Optional.ofNullable<T>(null);
    }
    return this;
  }
  /**
   * equality is defined as the contained value being equal to the other value.
   * @param other
   * @returns
   */

  public equals(other: any): boolean {
    return boilerplateEqualityCheck<Optional<T>>({ obj1: this, obj2: other }, (o1, o2) => {
      return o1.#value === o2.#value;
    });
  }

  public toString(): string {
    return `Optional[${this.#value === null ? "null" : this.#value}, typeof=${typeof this.#value}, hashcode=${this.hashCode()}]`;
  }

  /**
   * Checks if a value is present.
   * @returns {boolean} true if a value is present, false otherwise.
   */
  public isPresent(): boolean {
    return this.#value !== null;
  }

  /**
   * Gets the value if not null, otherwise throws an error.
   * @returns the value if present, throws  {@link Error} otherwise.
   */
  public get(): T {
    if (this.#value === null) {
      throw new Error("No value present");
    }
    return this.#value as T;
  }

  /**
   * Gets the value if present, otherwise returns the provided value.
   * @param other the value to return if no value is present.
   */
  public orElse(other: T): T {
    if (this.#value !== null) {
      return this.#value;
    } else {
      return other;
    }
  }

  /**
   * Gets the value if present, otherwise calls the provided function to get a value.
   *
   * Useful for lazy evaluation.
   * @param other a function that returns a value to return if no value is present.
   */
  public orElseGet(other: () => T): T {
    if (this.#value !== null) {
      return this.#value;
    } else {
      return other();
    }
  }
  /**
   * This returns the value if present, otherwise throws an error.
   *
   * Exceptional for offensive programming.
   * @param errorSupplier a function that returns an error to throw if no value is present.
   */
  public orElseThrow<E extends Error>(errorSupplier?: () => E): T {
    if (this.#value !== null) {
      return this.#value as T;
    } else if (errorSupplier) {
      throw errorSupplier();
    } else {
      throw new Error("No value present");
    }
  }

}
