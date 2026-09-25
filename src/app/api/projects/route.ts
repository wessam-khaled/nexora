import { validate, createProjectSchema } from "@/backend/validators";
import { createProject, listProjects } from "@/backend/services/projects";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(createProjectSchema, body);
    const { project, managerMembership } = await createProject(result);
    return successResponse({
      data: { project, managerMembership },
      statusCode: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const projects = await listProjects();
    return successResponse({ data: { projects } });
  } catch (error) {
    return handleError(error);
  }
}
