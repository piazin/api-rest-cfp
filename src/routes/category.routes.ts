import { Router } from "express";
import { create } from "../api/controllers/category.controller";

export const router = Router();

router.route("/").post(create);
