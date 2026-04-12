export const roleHierarchy = [
  "ADMIN",
  "SUB_ADMIN",
  "BRANCH_MANAGER",
  "RELATIONSHIP_MANAGER",
  "PARTNER",
] as const;

export type Role = (typeof roleHierarchy)[number];

export function canManageRole(actorRole: Role, targetRole: Role) {
  return roleHierarchy.indexOf(actorRole) <= roleHierarchy.indexOf(targetRole);
}

export function isAdmin(role: Role) {
  return role === "ADMIN" || role === "SUB_ADMIN";
}
