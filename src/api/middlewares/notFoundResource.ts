import { RequestHandler } from 'express';

export var notFoundResource: RequestHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Ops! Nada foi encontrado.',
  });
};
