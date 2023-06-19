import { UserService } from './user.service';
import { TokenService } from './token.service';
import { CategoryService } from './category.service';
import { SendEmailService } from './email/email.service';
import { AuthService } from './auth.service';
import { ResendEmailService } from './email/resend.service';

const userService = new UserService();
const tokenService = new TokenService();
const authService = new AuthService();
const categoryService = new CategoryService();

const resenderEmailService = new ResendEmailService();
const sendEmailService = new SendEmailService(resenderEmailService);

export { userService, tokenService, categoryService, sendEmailService, authService };
