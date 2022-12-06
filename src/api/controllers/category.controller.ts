import { Request, Response } from 'express';
import categoryService from '../services/category.service';

const { createService, findAllService } = new categoryService();

export async function findAll(req: Request, res: Response) {
  try {
    const response = await findAllService();
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
    const response = await createService(req.body);
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
