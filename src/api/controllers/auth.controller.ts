import { authService } from '@services';
import { Request, Response } from 'express';
import { Controller, Post } from 'routeify-express';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(req: Request, res: Response) {
    const response = await authService.register(req);
    return response.isRight()
      ? res.status(201).json({ status: 201, data: response.value })
      : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
  }

  @Post('login')
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const response = await authService.login(email, password);
    return response.isRight()
      ? res.status(200).json({ status: 200, data: response.value })
      : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
  }
}
