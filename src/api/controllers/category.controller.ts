import { Request, Response } from "express";
import categoryService from "../services/category.service";

const { create: createService } = new categoryService();

export async function create(req: Request, res: Response) {
  try {
    const response = await createService(req.body);
    return res.status(201).json({
      status: 201,
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "",
    });
  }
}
