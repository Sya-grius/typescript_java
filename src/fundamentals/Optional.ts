import { RunTimeException } from "../exceptions/RunTimeException";
import { Deserializable } from "./Deserializable";
import { boilerplateEqualityCheck, JavaObject } from "./Object";
import { Serializable } from "./Serializable";

export class Optional<T> extends JavaObject implements Serializable, Deserializable {
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

  static of<T>(value: T): Optional<T> {
    return new Optional<T>(value, { nullable: false });
  }

  static ofNullable<T>(value: T | null): Optional<T> {
    return new Optional<T>(value, { nullable: true });
  }

  static requireNonNull<T>(value: T | null, mssg?: string): Optional<T> {
    return new Optional<T>(value, { nullable: false, mssg });
  }
  /**
   * uses the callback provided if the value is present.
   * @param callback
   */
  ifPresent(consumer: (value: T) => void): void {
    if (this.#value !== null) {
      consumer(this.#value!);
    }
  }

  ifPresentOrElse(consumer: (value: T) => void, other: () => void): void {
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
  map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.#value === null) {
      return Optional.ofNullable<U>(null);
    }
    return Optional.of(mapper(this.#value as T));
  }
  /**
   * used to convert the internal optional value to a different type,
   * however, if it produces another Optional, it will flatten/unwrap it it.
   * @param mapper
   */
  flatMap<U>(mapper: (value: T) => Optional<U | Optional<U>>): Optional<U> {
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
  filter(predicate: (value: T) => boolean): Optional<T> {
    if (this.#value === null || !predicate(this.#value as T)) {
      return Optional.ofNullable<T>(null);
    }
    return this;
  }

  equals(other: any): boolean {
    return boilerplateEqualityCheck<Optional<T>>({ obj1: this, obj2: other }, (o1, o2) => {
      return o1.#value === o2.#value;
    });
  }

  toString(): string {
    return `Optional[${this.#value === null ? "null" : this.#value}, type=${typeof this.#value}, hashcode=${this.hashCode()}]`;
  }

  toJSON(): string {
    return JSON.stringify({
      type: "Optional",
      subType: typeof this.#value,
      value: this.#value,
    });
  }

  static fromJSON<T>(json: string, desiredType: string): Optional<T> {
    const val = JSON.parse(json);
    if (val === null || val === undefined || !val.type || val.type !== "Optional" || !val.subType! || val.value?.toString() !== "") {
      throw new RunTimeException("Cannot deserialize Optional from: `" + json + "`");
    }
    if (val.subType !== desiredType) {
      throw new RunTimeException(`Cannot deserialize Optional of type ${val.subType} to ${desiredType}`);
    }
    return new Optional<T>(val.value, { nullable: true });
  }
  /**
   * Checks if a value is present.
   * @returns {boolean} true if a value is present, false otherwise.
   */
  isPresent(): boolean {
    return this.#value !== null;
  }

  /**
   * Gets the value if not null, otherwise throws an error.
   * @returns the value if present, throws  {@link Error} otherwise.
   */
  get(): T {
    if (this.#value === null) {
      throw new Error("No value present");
    }
    return this.#value as T;
  }

  /**
   * Gets the value if present, otherwise returns the provided value.
   * @param other the value to return if no value is present.
   */
  orElse(other: T): T {
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
  orElseGet(other: () => T): T {
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
  orElseThrow<E extends Error>(errorSupplier?: () => E): T {
    if (this.#value !== null) {
      return this.#value as T;
    } else if (errorSupplier) {
      throw errorSupplier();
    } else {
      throw new Error("No value present");
    }
  }
}
