export const ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    MEMBER: "member",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function isRole(role: string): role is Role {
    return Object.values(ROLES).includes(role as Role);
}

export const INVITABLE_ROLES = {
    ADMIN: ROLES.ADMIN,
    MEMBER: ROLES.MEMBER,
}as const;

export type InvitsbleRole = (typeof INVITABLE_ROLES)[keyof typeof INVITABLE_ROLES];

export const CHANGEABLE_ROLES = {
  ADMIN: ROLES.ADMIN,
  MEMBER: ROLES.MEMBER,
} as const;

export type ChangeableRole =
  (typeof CHANGEABLE_ROLES)[keyof typeof CHANGEABLE_ROLES];

export const PROJECT_ROLES = {
    MANAGER: "manager",
    MEMBER: "member",
}as const;

export type ProjectUsersRole = (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES];