export class BusinessException extends Error {
  errorCode: string;
  message: string;
  module: string;
  service: string;
  action: string;

  constructor(
    errorCode: string,
    message: string,
    module?: string,
    service?: string,
    action?: string,
  ) {
    super(`${errorCode}: ${message}`);
    this.errorCode = errorCode;
    this.message = message;
    this.module = module;
    this.service = service;
    this.action = action;
  }

  public toString(): string {
    return `${this.errorCode}: ${this.message} :: Source:<${
      this.module || ''
    } ${this.service || ''} ${this.action || ''}>`;
  }

  public toJSON(): string {
    return `{errorCode:'${this.errorCode}', message:'${
      this.message
    }', source:'${this.module || ''} ${this.service || ''} ${
      this.action || ''
    }'}`;
  }
}