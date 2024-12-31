import BaseException from "./BaseException";

export default class UserServiceException extends BaseException {
    constructor(message: string, status: number) {
      super(message,status);
    }
  }