import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  } // set up constructor to have Object.setPrototypeOf because we are extending a built in class

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
