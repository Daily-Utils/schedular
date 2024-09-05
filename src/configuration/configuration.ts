export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.APP_ENV || 'development',
  apiKey: process.env.API_KEY,
  rollbar: {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    environment: process.env.ROLLBAR_ENVIRONMENT,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DATABASE,
  },
});
