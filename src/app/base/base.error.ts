/**
 * Abstract base for application errors. When the global error handler catches an error that is a
 * `BaseError`, it calls `handle()`, so each error type decides how it surfaces (toast, logger, …).
 */
export abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);
    // Restore the prototype chain so `instanceof` works for subclasses (TS/ES target quirk).
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
  }

  /** Activates when the global error handler catches the error; each error handles its own. */
  abstract handle(): Promise<void>;
}

/** A generic fallback error for unexpected failures (e.g. a missing CSRF token). */
export class GenericError extends BaseError {
  override async handle(): Promise<void> {
    // Default handling — projects can route this to their LoggerService / a toast.
    console.error(this.message);
  }
}
