import Joi from 'joi';
import { ITransaction } from '../api/models';
import constants from '../constants/transaction.constants';

const {
  err: { invalidDescription, invalidValue, invalidFields },
} = constants;

export function validateTransactionData(transactionData: ITransaction) {
  const validationSchema = Joi.object({
    value: Joi.number().required().error(new Error(invalidValue)),
    description: Joi.string().min(1).max(100).required().error(new Error(invalidDescription)),
    category: Joi.string().required().error(new Error(invalidFields)),
    date: Joi.date().required().error(new Error(invalidFields)),
    type: Joi.string().required().error(new Error(invalidFields)),
  });

  const { error, value } = validationSchema.validate(transactionData);
  return error ? { isValid: false, error } : { isValid: true };
}
