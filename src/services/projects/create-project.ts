import { prisma } from "@/lib/prisma";
import { requireRole } from "@/auth";
import { ROLES, PROJECT_STATUS, PROJECT_ROLES } from "@/constants";

export async function createProject(input: {
  name: string;
  description?: string;
}) {
  const currentUser = await requireRole([ROLES.OWNER, ROLES.ADMIN]);

  const result = await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        name: input.name,
        description: input.description,
        status: PROJECT_STATUS.PLANNING,
        createdBy: currentUser.id,
        companyId: currentUser.companyId,
      },
    });
    const managerMembership = await tx.projectMember.create({
      data: {
        projectId: newProject.id,
        userId: currentUser.id,
        projectRole: PROJECT_ROLES.MANAGER,
      },
    });
    return {
      newProject,
      managerMembership,
    };
  });
  return {
    project: {
      id: result.newProject.id,
      name: result.newProject.name,
      description: result.newProject.description,
      status: result.newProject.status,
    },
    managerMembership: {
      userId: result.managerMembership.userId,
      projectRole: result.managerMembership.projectRole,
    },
  };
}
