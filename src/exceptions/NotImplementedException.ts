import { TypeScriptJavaException } from "./TypeScriptJavaException";

/**
 * exception for when a method is not implemented in this package
 */
export class NotImplementedException extends TypeScriptJavaException {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "NotImplementedException";
  }
}
