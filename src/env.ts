import z from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().optional().default(3000),
  JWT_PRIVATE_KEY: z.string().min(1),
  JWT_PUBLIC_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
