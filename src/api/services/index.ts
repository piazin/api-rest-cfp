import { UserService } from './user.service';
import { TokenService } from './token.service';
import { CategoryService } from './category.service';

const userService = new UserService();
const tokenService = new TokenService();
const categoryService = new CategoryService();

export { userService, tokenService, categoryService };
