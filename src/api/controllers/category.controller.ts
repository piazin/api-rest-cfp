import { Request, Response } from 'express';
import { categoryService } from '../services';

export async function findAll(req: Request, res: Response) {
  try {
    const response = await categoryService.findAll();
    return res.status(200).json({
      status: 200,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(500).json({
      status: 500,
      message: message,
    });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const response = await categoryService.create(req.body);
    return res.status(201).json({
      status: 201,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(500).json({
      status: 500,
      message: message,
    });
  }
}
