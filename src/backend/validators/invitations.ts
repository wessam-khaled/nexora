import { z } from "zod";
import { INVITABLE_ROLES } from "@/backend/constants/roles";

export const createInvitationSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(Object.values(INVITABLE_ROLES)),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const acceptInvitationSchema = z.object({
  id: z.coerce.number().int().positive(),
  token: z.string().length(64),
  name: z.string().trim().min(1),
  password: z.string().min(8),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
