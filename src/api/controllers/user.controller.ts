import { Request, Response } from 'express';
import { responseInternalError } from '../../errors/responseInternalError';
import { userService } from '../services';
import { tokenService } from '../services';

const { generatePassRecoveryCode, validateTokenCode } = tokenService;

export async function find(req: Request, res: Response) {
  const response = await userService.findById(req.user.id);
  return response.isRight()
    ? res.status(200).json({ status: 200, data: response.value })
    : res.status(response.value.statusCode).json({
        status: response.value.statusCode,
        message: response.value.message,
      });
}

export async function update(req: Request, res: Response) {
  try {
    const response = await userService.update(req.body, req.user.id);
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

export async function requestPasswordRecoveryCode(req: Request, res: Response) {
  const response = await generatePassRecoveryCode(req.body.email);
  return response.isRight()
    ? res.status(200).json({ status: 200, message: response.value })
    : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
}

export async function verifyResetCode(req: Request, res: Response) {
  const response = await validateTokenCode(req.body.code);
  return response.isRight()
    ? res.status(200).json({ status: 200, message: response.value })
    : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
}

export async function changePassword(req: Request, res: Response) {
  const response = await userService.changePassword(req.body.email, req.body.password);
  return response.isRight()
    ? res.status(200).json({ status: 200, data: response.value })
    : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
}

export async function uploadProfilePic(req: Request, res: Response) {
  const response = await userService.uploadProfilePic(req.body.owner, req.file);
  return response.isRight()
    ? res.status(200).json({ status: 200, data: response.value })
    : res.status(response.value.statusCode).json({ status: response.value.statusCode, message: response.value.message });
}

export async function deleteProfilePic(req: Request, res: Response) {
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
