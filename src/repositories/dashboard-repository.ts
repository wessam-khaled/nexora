import { prisma } from "@/lib/prisma";
import { TASK_STATUS } from "@/constants";
export function countCompanyProjects(companyId: number) {
  return prisma.project.count({
    where: {
      companyId,
    },
  });
}

export function countMemberProjects(userId: number) {
  return prisma.projectMember.count({
    where: {
      userId,
    },
  });
}

export function getProjectCountsByStatus(companyId: number) {
  return prisma.project.groupBy({
    by: ["status"],
    where: {
      companyId,
    },
    _count: {
      status: true,
    },
  });
}

export function getProjectCountsByStatusForMember(userId: number) {
  return prisma.project.groupBy({
    by: ["status"],
    where: {
      projectMembers: {
        some: {
          userId,
        },
      },
    },
    _count: {
      status: true,
    },
  });
}

export function countCompanyTasks(companyId: number) {
  return prisma.task.count({
    where: {
      project: {
        companyId,
      },
    },
  });
}

export function countMemberTasks(userId: number) {
  return prisma.task.count({
    where: {
      project: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
    },
  });
}

export function getTasksByStatus(companyId: number) {
  return prisma.task.groupBy({
    by: ["status"],
    where: {
      project: {
        companyId,
      },
    },
    _count: {
      status: true,
    },
  });
}

export function getTasksByStatusForMember(userId: number) {
  return prisma.task.groupBy({
    by: ["status"],
    where: {
      project: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
    },
    _count: {
      status: true,
    },
  });
}

export function countOverdueCompanyTasks(companyId: number) {
  return prisma.task.count({
    where: {
      project: {
        companyId,
      },
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: TASK_STATUS.COMPLETED,
      },
    },
  });
}

export function countOverdueMemberTasks(userId: number) {
  return prisma.task.count({
    where: {
      project: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: TASK_STATUS.COMPLETED,
      },
    },
  });
}

export function countMyTasks(userId: number) {
  return prisma.task.count({
    where: {
      assignedTo: userId,
    },
  });
}

export function countCompanyMembers(companyId: number) {
  return prisma.user.count({
    where: {
      companyId,
    },
  });
}
