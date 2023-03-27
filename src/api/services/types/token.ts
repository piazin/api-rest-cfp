import { IToken } from '../../../api/models';
import { Either } from '../../../errors/either';
import { ValidationError } from '../../../errors/error';

export type ResponseToken = Either<ValidationError, string | boolean>;
export type ResponseTokenChecked = Either<ValidationError, { status: true; data: IToken }>;
