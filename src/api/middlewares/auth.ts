import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import config from '../../config';
const { jwt_secret } = config;

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization)
    return res.status(401).json({
      status: 401,
      message: 'Não autorizado: token ausente',
    });

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer' || !token) {
    return res.status(401).json({
      status: 401,
      message: 'Não autorizado: token não encontrado',
    });
  }

  try {
    var decoded = jwt.verify(token, jwt_secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: `Não autorizado: ${error.message}` });
  }
}
