import { Injectable } from '@nestjs/common';
import * as Joi from 'joi'; // Import Joi from the 'joi' package

@Injectable()
export class UserValidator {
  schema = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  };
}
