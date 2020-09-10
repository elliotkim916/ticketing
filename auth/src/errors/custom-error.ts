export abstract class CustomError extends Error {
  abstract statusCode: number; // if extending CustomError, subclass must have statusCode property that is a number

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
