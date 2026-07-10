const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),

  PORT: z.coerce.number().int().positive(),

  DATABASE_URL: z.url(),

  REDIS_URL: z.url(),

  SESSION_SECRET: z.string().min(10),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

module.exports = Object.freeze({
  app:{
    env: result.data.NODE_ENV,
    port:result.data.PORT
  },
  database:{
    url: result.data.DATABASE_URL
  },
  redis:{
    url: result.data.REDIS_URL
  },
  session:{
    secret: result.data.SESSION_SECRET
  }
});