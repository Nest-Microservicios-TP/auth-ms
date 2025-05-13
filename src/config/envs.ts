import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USERNAME: string;
  DATABASE_PASS: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_HOST: joi.string().required(),
    DATABASE_PORT: joi.number().required(),
    DATABASE_NAME: joi.string().required(),
    DATABASE_USERNAME: joi.string().required(),
    DATABASE_PASS: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  database_host: envVars.DATABASE_HOST,
  database_port: envVars.DATABASE_PORT,
  database_name: envVars.DATABASE_NAME,
  database_username: envVars.DATABASE_USERNAME,
  database_pass: envVars.DATABASE_PASS,
};
