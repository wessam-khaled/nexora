import {
  validate,
  addMemberSchema,
  projectIdSchema,
  changeProjectMemberRoleSchema,
  removeMemberSchema,
} from "@/validators";
import {
  addMember,
  listMembers,
  changeProjectMemberRole,
  removeProjectMember,
} from "@/services/project-members";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { userId, role } = await request.json();
    const result = validate(addMemberSchema, { projectId: id, userId, role });
    const membership = await addMember(result);

    return successResponse({
      data: {
        userId: membership.userId,
        projectId: membership.projectId,
        projectRole: membership.projectRole,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = validate(projectIdSchema, { id });
    const members = await listMembers(result.id);
    return successResponse({ data: { members } });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { userId, role } = await request.json();
    const result = validate(changeProjectMemberRoleSchema, {
      projectId: id,
      userId,
      role,
    });
    const changeProjectRole = await changeProjectMemberRole(
      result.projectId,
      result.userId,
      result.role,
    );
    return successResponse({ data: { role: changeProjectRole.projectRole } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { userId } = await request.json();
    const result = validate(removeMemberSchema, {
      projectId: id,
      userId: userId,
    });
    await removeProjectMember(result.userId, result.projectId);
    return successResponse({
      data: { message: "Member removed successfully" },
    });
  } catch (error) {
    return handleError(error);
  }
}
