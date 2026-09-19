export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
};

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
