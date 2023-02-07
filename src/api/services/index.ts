import { UserService } from './user.service';
import { TokenService } from './token.service';
import { CategoryService } from './category.service';
import { SendEmailService } from './email.service';

const userService = new UserService();
const tokenService = new TokenService();
const categoryService = new CategoryService();
const sendEmailService = new SendEmailService();

export { userService, tokenService, categoryService, sendEmailService };
