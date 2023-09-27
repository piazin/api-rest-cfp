import auth from '@middlewares/auth';
import { Request, Response } from 'express';
import { categoryService } from '@services';
import { responseInternalError } from '@either/responseInternalError';
import { Controller, Get, Post, Delete, UseMiddleware } from 'routeify-express';

@Controller('category')
export class CategoryController {
  @Get()
  @UseMiddleware(auth)
  async findAll(req: Request, res: Response) {
    try {
      console.log(req.user);
      const response = await categoryService.findAll(req.user?.id);
      return response.isSuccess()
        ? res.status(200).json({
            status: 200,
            data: response.value,
          })
        : res.status(response.value.statusCode).json({
            status: response.value.statusCode,
            message: response.value.message,
          });
    } catch (error) {
      responseInternalError(res);
    }
  }

  @Post()
  @UseMiddleware(auth)
  async create(req: Request, res: Response) {
    try {
      const response = await categoryService.create(req.body, req.user?.id);
      return response.isSuccess()
        ? res.status(201).json({
            status: 201,
            data: response.value,
          })
        : res.status(response.value.statusCode).json({
            status: response.value.statusCode,
            message: response.value.message,
          });
    } catch (error) {
      responseInternalError(res);
    }
  }

  @Delete(':id')
  @UseMiddleware(auth)
  async remove(req: Request, res: Response) {
    try {
      const response = await categoryService.delete(req.params.id, req.user?.id);
      return response.isSuccess()
        ? res.status(200).json({
            status: 200,
            data: response.value,
          })
        : res.status(response.value.statusCode).json({
            status: response.value.statusCode,
            message: response.value.message,
          });
    } catch (error) {
      responseInternalError(res);
    }
  }
}
