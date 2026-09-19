import { validate, createCommentSchema, getTaskSchema } from "@/validators";
import { createComment, listComments } from "@/services/comments";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function POST(request: Request, { params }: { params: Promise<{ id: string, taskId: string }> }) {
    try{
        const { id, taskId } = await params;
        const body = await request.json();
        const idSchema = validate(getTaskSchema, { projectId: id, taskId: taskId });
        const result = validate(createCommentSchema, body);
        const comment = await createComment({...result, ...idSchema});
        return successResponse({ data: comment });
    }catch(error){
        return handleError(error);
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string, taskId: string }> }) {
  try {
    const { id, taskId } = await params;
    const idSchema = validate(getTaskSchema, { projectId: id, taskId: taskId });
    const comments = await listComments(idSchema.taskId, idSchema.projectId);
    return successResponse({ data: comments });
  } catch (error) {
    return handleError(error);
  }
}