import { Request, Response } from 'express';
import { authService } from '../services';

export async function register(req: Request, res: Response) {
  const response = await authService.register(req);
  return response.isRight()
    ? res.status(201).json({ status: 201, data: response.value })
    : res
        .status(response.value.statusCode)
        .json({ status: response.value.statusCode, message: response.value.message });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const response = await authService.login(email, password);
  return response.isRight()
    ? res.status(200).json({ status: 200, data: response.value })
    : res
        .status(response.value.statusCode)
        .json({ status: response.value.statusCode, message: response.value.message });
}
