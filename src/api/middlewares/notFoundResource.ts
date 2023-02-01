import { Request, Response, NextFunction } from 'express';

export function notFoundResource(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: 404,
    message: 'Ops Bad Request! Nothing around here',
  });
}
