const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV : z.enum(["development", "test", "production"]),
  PORT : z.coerce.number().int().positive(),
  DATABASE_URL : z.url(),
  REDIS_URL : z.url(),
  COOKIE_SECRET: z.string().min(10),
  LOG_LEVEL : z.enum(["trace","debug","info","warn","error","fatal"]),
  OIDC_ISSUER : z.url(),
  OIDC_CLIENT_ID : z.string().min(10),
  OIDC_CLIENT_SECRET : z.string().min(10),
  OIDC_REDIRECT_URI : z.url(),
  JWT_SECRET : z.string().min(10),
  JWT_ISSUER : z.string().trim().min(1),
  JWT_AUDIENCE : z.string().trim().min(1),
  JWT_EXPIRATION_SECONDS: z.coerce.number().int().min(1).max(1800)
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
    port:result.data.PORT,
  },
  logger:{
    level: result.data.LOG_LEVEL
  },
  database:{
    url: result.data.DATABASE_URL
  },
  redis:{
    url: result.data.REDIS_URL
  },
  oidc:{
    issuer: result.data.OIDC_ISSUER,
    client_id: result.data.OIDC_CLIENT_ID,
    client_secret: result.data.OIDC_CLIENT_SECRET,
    redirect_uri: result.data.OIDC_REDIRECT_URI
  },
  cookie:{
    secret: result.data.COOKIE_SECRET
  },
  jwt:{
    secret: result.data.JWT_SECRET,
    issuer: result.data.JWT_ISSUER,
    audience: result.data.JWT_AUDIENCE,
    expirationSeconds: result.data.JWT_EXPIRATION_SECONDS
  }
});