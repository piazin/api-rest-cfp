import { Request, Response } from 'express';
import { transactionService } from '@services';
import { Controller, Get, Post, Delete, Put, UseMiddleware } from 'routeify-express';
import auth from '@middlewares/auth';

interface IRequest extends Request {
  user_id: string;
}

@Controller('transaction')
export class TransactionController {
  @Get()
  @UseMiddleware(auth)
  async getTransactionByUserId(req: IRequest, res: Response) {
    const response = await transactionService.findByOwnerId(req.user!.id, req);
    return response.isRight()
      ? res.status(200).json({
          status: 200,
          results: response.value.transactions?.length,
          data: response.value,
        })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  }

  @Post()
  @UseMiddleware(auth)
  async createTransaction(req: Request, res: Response) {
    const response = await transactionService.create(req.body, req.user!.id);
    return response.isRight()
      ? res.status(201).json({ status: 201, data: response.value })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  }

  @Put(':id')
  @UseMiddleware(auth)
  async updateTransaction(req: Request, res: Response) {
    const response = await transactionService.update(req.params.id, req.user!.id, req.body);
    return response.isRight()
      ? res.status(201).json({ status: 200, data: response.value })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  }

  @Delete(':id')
  @UseMiddleware(auth)
  async removeTransaction(req: Request, res: Response) {
    const response = await transactionService.delete(req.params.id, req.user!.id);
    return response.isRight()
      ? res.status(204).json({ status: 204, data: response.value })
      : res.status(response.value.statusCode).json({
          status: response.value.statusCode,
          message: response.value.message,
        });
  }
}
