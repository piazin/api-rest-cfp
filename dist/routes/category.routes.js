"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const category_controller_1 = require("../api/controllers/category.controller");
exports.router = (0, express_1.Router)();
exports.router.route("/").post(category_controller_1.create);
//# sourceMappingURL=category.routes.js.map