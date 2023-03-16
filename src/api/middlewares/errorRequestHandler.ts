import { ErrorRequestHandler } from 'express';

export var errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    console.error('🚀 ~ file: errorRequestHandler.ts:10 ~ errorRequestHandler ~ err', err);
    return res.status(400).json({
      status: 400,
      message: 'Ops! Bad Request',
    });
  }
  next();
};
