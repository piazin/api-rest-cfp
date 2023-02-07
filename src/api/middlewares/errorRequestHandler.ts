import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export function errorRequestHandler(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    console.error('🚀 ~ file: errorRequestHandler.ts:10 ~ errorRequestHandler ~ err', err);
    return res.status(400).json({
      status: 400,
      message: 'Ops! Bad Request',
    });
  }
  next();
}
