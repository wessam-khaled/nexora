import { requireAuth } from "@/auth";
import { AppError } from "@/errors/app-error";
import { ROLES, ERROR_CODES } from "@/constants";
import {
  countCompanyProjects,
  countMemberProjects,
  getProjectCountsByStatus,
  getProjectCountsByStatusForMember,
  countCompanyTasks,
  countMemberTasks,
  getTasksByStatus,
  getTasksByStatusForMember,
  countOverdueCompanyTasks,
  countOverdueMemberTasks,
  countMyTasks,
  countCompanyMembers,
} from "@/repositories/dashboard-repository";

export async function getDashboard() {
  const user = await requireAuth();
  if (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) {
    const [
      projectsTotal,
      projectsByStatus,
      tasksTotal,
      tasksByStatus,
      overdue,
      myTasks,
      teamTotal,
    ] = await Promise.all([
      countCompanyProjects(user.companyId),
      getProjectCountsByStatus(user.companyId),
      countCompanyTasks(user.companyId),
      getTasksByStatus(user.companyId),
      countOverdueCompanyTasks(user.companyId),
      countMyTasks(user.id),
      countCompanyMembers(user.companyId),
    ]);
    const projectsStatus = projectsByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );
    const tasksStatus = tasksByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );
    return {
      projects: {
        total: projectsTotal,
        byStatus: projectsStatus,
      },
      tasks: {
        total: tasksTotal,
        byStatus: tasksStatus,
        overdue,
        myTasks,
      },
      team: {
        total: teamTotal,
      },
    };
  }
  if (user.role === ROLES.MEMBER) {
    const [
        projectsTotal,
        projectsByStatus,
        tasksTotal,
        tasksByStatus,
        overdue,
        myTasks,
    ] = await Promise.all([
      countMemberProjects(user.id),
      getProjectCountsByStatusForMember(user.id),
      countMemberTasks(user.id),
      getTasksByStatusForMember(user.id),
      countOverdueMemberTasks(user.id),
      countMyTasks(user.id),
    ]);
    const projectsStatus = projectsByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );
    const tasksStatus = tasksByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );
    return {
      projects: {
        total: projectsTotal,
        byStatus: projectsStatus,
      },
      tasks: {
        total: tasksTotal,
        byStatus: tasksStatus,
        overdue,
        myTasks,
      },
    };
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}
