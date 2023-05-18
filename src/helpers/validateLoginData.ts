import Joi from 'joi';

export const validateLoginData = (email: string, password: string) => {
  const schemaValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schemaValidation.validate({ email, password });
  return error ? { isValid: false, error } : { isValid: true };
};
