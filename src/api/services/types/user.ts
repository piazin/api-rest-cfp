import { Either } from '../../../errors/either';
import { ResponseUserProps } from '../interfaces/auth';
import { ValidationError } from '../../../errors/error';
import { IProfilePic, IUser } from '../../../api/models';

export type ResponseUser = Either<ValidationError, ResponseUserProps>;
export type ResponseUserFind = Either<ValidationError, IUser>;
export type ResponseChangeUserPassword = Either<ValidationError, string>;
export type ResponseUploadProfilePic = Either<ValidationError, IProfilePic>;
