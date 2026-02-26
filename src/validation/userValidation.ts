import { z } from "zod";

export const createUSerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["owner", "admin", "manager", "user"]).default("user"),
});

export const createTenantSchema = z.object({
  name: z.string(),
  subDomain: z.string(),
  contactEmail: z.email(),
  contactPhone: z.string().length(10),
  address: z.string(),
});


export type CreateTenantDto = z.infer<typeof createTenantSchema>;