/**
 * Basic runtime exception class.
 * Its not much other than a wrapper for the standard Error class, however
 * its value here is to distinguish runtime exceptions originating from this library
 *
 */

export class RunTimeException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "RunTimeException";
  }
}
