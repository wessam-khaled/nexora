import { z } from "zod";

const envSchema = z.object({
  database : z.object({
    url : z.string()
  }),
  env : z.enum(["development", "production", "test"])
});

export const config = envSchema.parse({
    database : {
        url : process.env.DATABASE_URL,
    },
    env : process.env.NODE_ENV
})