import {
  validate,
  createTaskSchema,
  projectIdSchema,
} from "@/backend/validators";
import { createTask, listTasks } from "@/backend/services/tasks";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = validate(createTaskSchema, { projectId: id, ...body });
    const task = await createTask(result);
    return successResponse({
      data: { task },
      statusCode: 201,
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
    const tasks = await listTasks(result.id);
    return successResponse({ data: { tasks } });
  } catch (error) {
    return handleError(error);
  }
}
