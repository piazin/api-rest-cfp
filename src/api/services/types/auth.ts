import { Either } from '../../../errors/either';
import { ValidationError } from '../../../errors/error';
import { ResponseUserProps } from '../interfaces/auth';

export type ResponseAuth = Either<ValidationError, ResponseUserProps>;
