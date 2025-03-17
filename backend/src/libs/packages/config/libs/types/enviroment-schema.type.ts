type EnviromentSchema = {
  DATABASE_URL: string;
  JWT_SECRET_KEY: string;
  AUTH_ALGORITHM: string;
  REFRESH_TOKEN_EXPIRATION_TIME: string;
  ACCESS_TOKEN_EXPIRATION_TIME: string;
  USER_PASSWORD_SALT_ROUNDS: number;
};

export { type EnviromentSchema };
