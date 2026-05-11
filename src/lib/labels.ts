export function translatePlanType(planType: string): string {
  switch (planType) {
    case "chronological":
      return "Cronológico";
    case "traditional":
      return "Tradicional";
    case "new_testament":
      return "Novo Testamento";
    default:
      return planType;
  }
}

export function translatePlanStatus(status: string): string {
  switch (status) {
    case "active":
      return "Ativo";
    case "paused":
      return "Pausado";
    case "completed":
      return "Concluído";
    default:
      return status;
  }
}

export function translateUserRole(role: string): string {
  switch (role) {
    case "admin":
      return "Administrador";
    case "user":
      return "Usuário";
    case "guest":
      return "Visitante";
    default:
      return role;
  }
}
