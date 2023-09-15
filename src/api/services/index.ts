import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { CategoryService } from './category.service';
import { SendEmailService } from './email/email.service';
import { TransactionService } from './transaction.service';
import { ResendEmailService } from './email/resend.service';

const authService = new AuthService();
const userService = new UserService();
const tokenService = new TokenService();
const categoryService = new CategoryService();
const transactionService = new TransactionService();

const resenderEmailService = new ResendEmailService();
const sendEmailService = new SendEmailService(resenderEmailService);

export { userService, tokenService, categoryService, sendEmailService, authService, transactionService };
