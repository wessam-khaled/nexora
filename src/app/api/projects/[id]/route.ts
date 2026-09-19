import { validate, projectIdSchema, updateProjectSchema } from "@/validators";
import { getProject, updateProject, deleteProject } from "@/services/projects";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
    try{
        const { id } = await params;
        const result = validate(projectIdSchema, { id });
        const project = await getProject(result.id);
        return successResponse({ data:  project  });

    }catch(error){
        return handleError(error);
    }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
){
    try{
        const { id } = await params;
        const { name, description, status } = await request.json();
        const idSchema = validate(projectIdSchema, { id });
        const result = validate(updateProjectSchema, { name, description, status });
        const project = await updateProject(idSchema.id, result);
        return successResponse({ data:  project  });
    }catch(error){
        return handleError(error);
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
){
    try{
        const { id } = await params;
        const result = validate(projectIdSchema, { id });
        const project = await deleteProject(result.id);
        return successResponse({ data:  project  });
    }catch(error){
        return handleError(error);
    }
}