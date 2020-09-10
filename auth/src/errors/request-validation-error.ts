import { ValidationError } from 'express-validator'; // this is a type of error
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters'); // calling super to invoke the constructor of the base/parent class, in this case Error
    console.log('RequestValidationError class', this.errors);

    // only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype); // just behind the scene stuff to get our class to work correctly
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
