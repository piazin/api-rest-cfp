interface IBaseErrorParams {
  message: string;
  statusCode: number;
  errorLocationCode: string;
}

class baseError extends Error {
  private _message: string;
  private _statusCode: number;
  private errorLocationCode: string;

  constructor({ message, statusCode = 500, errorLocationCode }: IBaseErrorParams) {
    super();
    this._message = message;
    this._statusCode = statusCode;
    this.errorLocationCode = errorLocationCode;
  }

  public get message(): string {
    return this._message;
  }

  public get statusCode(): number {
    return this._statusCode;
  }
}

class InternalServerError extends baseError {
  constructor({ message, statusCode, errorLocationCode }: IBaseErrorParams) {
    super({
      message: message || 'Um erro interno não esperado aconteceu.',
      statusCode: statusCode || 500,
      errorLocationCode: errorLocationCode,
    });
  }
}
