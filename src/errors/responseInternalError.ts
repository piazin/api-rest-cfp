import { Response } from 'express';

export function responseInternalError(res: Response) {
  return res.status(500).json({
    status: 500,
    message: 'Um erro interno não esperado aconteceu.',
  });
}
