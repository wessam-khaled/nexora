import {
  validate,
  getTaskSchema,
  updateTaskSchema,
} from "@/backend/validators";
import { getTask, updateTask, deleteTask } from "@/backend/services/tasks";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const { id, taskId } = await params;
    const result = validate(getTaskSchema, { projectId: id, taskId: taskId });
    const task = await getTask(result.projectId, result.taskId);
    return successResponse({ data: { task } });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const { id, taskId } = await params;
    const data = await request.json();
    const idSchema = validate(getTaskSchema, { projectId: id, taskId: taskId });
    const result = validate(updateTaskSchema, data);
    const task = await updateTask(idSchema.projectId, idSchema.taskId, result);
    return successResponse({ data: { task } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const { id, taskId } = await params;
    const result = validate(getTaskSchema, { projectId: id, taskId: taskId });
    const deletedTask = await deleteTask(result.projectId, result.taskId);
    return successResponse({ data: deletedTask });
  } catch (error) {
    return handleError(error);
  }
}
