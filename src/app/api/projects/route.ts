import { validate, createProjectSchema } from "@/validators";
import { createProject,listProjects } from "@/services/projects";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const result = validate(createProjectSchema, body);
        const { project, managerMembership } = await createProject(result);
        return successResponse({ data: { project, managerMembership }, statusCode: 201 });

    }catch(error){
        return handleError(error);
    }
}

export async function GET(){
  try {
    const projects = await listProjects();
    return successResponse({ data: { projects } });
  } catch (error) {
    return handleError(error);
  }
}