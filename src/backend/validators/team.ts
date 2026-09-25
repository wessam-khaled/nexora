import { z } from "zod";
import { CHANGEABLE_ROLES } from "@/backend/constants";

export const changeMemberRoleSchema = z.object({
  memberId: z.coerce.number().int().positive(),
  role: z.enum(Object.values(CHANGEABLE_ROLES)),
});

export const memberIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
