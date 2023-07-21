import Joi from "joi";

const validators = {
  registerSchema: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    picturePath: Joi.string().required(),
  }),

  loginSchema: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default validators;
