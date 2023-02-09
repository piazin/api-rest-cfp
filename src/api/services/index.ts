import { UserService } from './user.service';
import { TokenService } from './token.service';
import { CategoryService } from './category.service';
import { SendEmailService } from './email.service';
import { AuthService } from './auth.service';

const userService = new UserService();
const tokenService = new TokenService();
const authService = new AuthService();
const categoryService = new CategoryService();
const sendEmailService = new SendEmailService();

export { userService, tokenService, categoryService, sendEmailService, authService };
