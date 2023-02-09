import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import config from '../../config';
const { jwt_secret } = config;

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization)
    return res.status(404).json({
      status: 401,
      message: 'Não autorizado: token não encontrado',
    });

  var token = req.headers.authorization.split(' ')[1];
  if (!token)
    return res.status(401).json({
      status: 401,
      message: 'Não autorizado: token não encontrado',
    });

  jwt.verify(token, jwt_secret, (err, decode) => {
    if (err)
      return res.status(401).json({ status: 401, message: `Não autorizado: ${err.message}` });

    req.user = decode;
    next();
  });
}
