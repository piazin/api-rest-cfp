import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import tokenService from '../services/token.service';

const {
  createUser,
  findOneUserByID,
  uploadProfilePic: upProPic,
  deleteProfilePic: delProPic,
  signInUser,
  changePassword: changePass,
} = new userService();

const { generatePassRecoveryCode, validateTokenCode } = new tokenService();

export async function find(req: Request, res: Response) {
  try {
    var response = await findOneUserByID(req.params.id);
    return res.status(200).json({
      status: 200,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      status: 400,
      message: message,
    });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const response = await createUser(req.body);
    return res.status(201).json({
      status: 201,
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
}

export async function requestPasswordRecoveryCode(req: Request, res: Response) {
  try {
    let ip: string | string[] =
      req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for'];

    const response = await generatePassRecoveryCode(req.body.email, ip);
    return res.status(200).json({
      status: 200,
      message: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      status: 400,
      message: message,
    });
  }
}

export async function validateCode(req: Request, res: Response) {
  try {
    const response = await validateTokenCode(req.body.code);
    return res.status(200).json({
      status: 200,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      message: message,
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const response = await changePass(req.body.user_id, req.body.password);
    return res.status(200).json({
      status: 200,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      status: 400,
      message: message,
    });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const response = await signInUser(req.body.email, req.body.password);
    return res.status(200).json({
      status: 200,
      message: 'authentication success',
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
}

export async function uploadProfilePic(req: Request, res: Response) {
  try {
    const response = await upProPic(req.body.owner, req.file);
    return res.status(200).json({
      status: 200,
      data: {
        avatar: response,
      },
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      status: 400,
      message: message,
    });
  }
}

export async function deleteProfilePic(req: Request, res: Response) {
  try {
    const response = await delProPic(req.body.fileId);
    return res.status(204).json({
      status: 204,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      status: 400,
      message: message,
    });
  }
}
