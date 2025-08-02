import { TypeScriptJavaException } from "./TypeScriptJavaException";

/**
 * basic implementa of a package level exception.
 */
export class RunTimeException extends TypeScriptJavaException {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "RunTimeException";
  }
}
