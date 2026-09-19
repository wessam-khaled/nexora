import { AppError } from "@/errors/app-error";
import { requireAuth } from "@/auth";
import { ROLES } from "@/constants";
import {
  findProjectById,
  findProjectMember,
  countProjectTasks,
  countProjectMembers,
} from "@/repositories";

export async function getProject(id: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(id, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  const projectMember = await findProjectMember(currentUser.id, id);
  if (!projectMember && currentUser.role !== ROLES.OWNER) {
    throw new AppError("You are not a member of this project", 403);
  }
  const [membersCount, tasksCount] = await Promise.all([
    countProjectMembers(project.id),
    countProjectTasks(project.id),
  ]);
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    membersCount: membersCount,
    tasksCount: tasksCount,

  };
}
