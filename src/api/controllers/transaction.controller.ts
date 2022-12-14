import { Request, Response } from 'express';
import transactionsService from '../services/transaction.service';

const transaction = new transactionsService();

interface IRequest extends Request {
  user_id: string;
}

export async function getTransactionByUserId(req: IRequest, res: Response) {
  try {
    const response = await transaction.findByOwnerID(req.params.id, req);
    return res.status(200).json({
      status: 200,
      results: response.results,
      data: {
        transactions: response.data,
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

export async function createTransaction(req: Request, res: Response) {
  try {
    const response = await transaction.create(req.body, req.user.user_id);
    return res.status(201).json({
      status: 201,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    return res.status(400).json({
      status: 400,
      message,
    });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  try {
    const response = await transaction.update(req.params.id, req.body);
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch ({ message }) {
    console.error(message);
    res.status(400).json({
      status: 400,
      message: message,
    });
  }
}

export async function removeTransaction(req: Request, res: Response) {
  try {
    const response = await transaction.delete(req.params.id);
    res.status(204).json({
      status: 204,
      message: response,
    });
  } catch ({ status, message }) {
    console.error(message);
    res.status(status).json({
      status: status,
      message,
    });
  }
}
