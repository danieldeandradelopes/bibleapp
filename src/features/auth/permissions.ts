export type UserRole = "admin" | "user";

export function canShareReadyMessage(role?: UserRole | null): boolean {
  return role === "admin";
}
