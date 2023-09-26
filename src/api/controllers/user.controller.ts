import multer from 'multer';
import auth from '@middlewares/auth';
import { Request, Response } from 'express';
import multerConfig from '../../config/multer.config';
import { tokenService, userService } from '@services';
import { responseInternalError } from '@either/responseInternalError';
import { Controller, Get, Post, Delete, Put, Patch, UseMiddleware } from 'routeify-express';

const { generatePassRecoveryCode, validateTokenCode } = tokenService;

const upload = multer(multerConfig);

@Controller('user')
export class UserController {
  @Get()
  @UseMiddleware(auth)
  async find(req: Request, res: Response) {
    const response = await userService.findById(req.user!.id);
    return response.isRight()
      ? res.status(200).json({ status: 200, data: response.value })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  }

  @Put()
  @UseMiddleware(auth)
  async update(req: Request, res: Response) {
    try {
      const response = await userService.update(req.body, req.user!.id);
      return response.isRight()
        ? res.status(200).json({ status: 200, data: response.value })
        : res.status(response.value.statusCode).json({
            status: response.value.statusCode,
            message: response.value.message,
          });
    } catch (error) {
      console.error('🚀 ~ file: user.controller.ts:28 ~ update ~ error:', error.message);
      responseInternalError(res);
    }
  }

  @Post('password-reset-request')
  async requestPasswordRecoveryCode(req: Request, res: Response) {
    const response = await generatePassRecoveryCode(req.body.email);
    return response.isRight()
      ? res.status(200).json({ status: 200, message: response.value })
      : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
  }

  @Post('verify-reset-code')
  async verifyResetCode(req: Request, res: Response) {
    const response = await validateTokenCode(req.body.code);
    return response.isRight()
      ? res.status(200).json({ status: 200, message: response.value })
      : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
  }

  @Patch('change-password')
  async changePassword(req: Request, res: Response) {
    const response = await userService.changePassword(req.body.email, req.body.password);
    return response.isRight()
      ? res.status(200).json({ status: 200, data: response.value })
      : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
  }

  @Post('avatar')
  @UseMiddleware(auth)
  @UseMiddleware(upload.single('avatar'))
  async uploadProfilePic(req: Request, res: Response) {
    const response = await userService.uploadProfilePic(req.user?.id, req.file);
    return response.isRight()
      ? res.status(200).json({ status: 200, data: response.value })
      : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
  }

  @Delete('avatar')
  @UseMiddleware(auth)
  async deleteProfilePic(req: Request, res: Response) {
    try {
      const response = await userService.deleteProfilePic(req.body.fileId);
      return res.status(204).json({
        status: 204,
        data: response,
      });
    } catch ({ message }) {
      console.error(message);
      responseInternalError(res);
    }
  }
}
