import {
  validate,
  updateCommentSchema,
  commentIdSchema,
} from "@/backend/validators";
import { updateComment, deleteComment } from "@/backend/services/comments";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ id: string; taskId: string; commentId: string }> },
) {
  try {
    const { id, taskId, commentId } = await params;
    const body = await request.json();
    const idSchema = validate(commentIdSchema, {
      projectId: id,
      taskId: taskId,
      commentId: commentId,
    });
    const result = validate(updateCommentSchema, body);
    const comment = await updateComment(
      idSchema.projectId,
      idSchema.taskId,
      idSchema.commentId,
      result,
    );
    return successResponse({ data: { comment } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: { params: Promise<{ id: string; taskId: string; commentId: string }> },
) {
  try {
    const { id, taskId, commentId } = await params;
    const idSchema = validate(commentIdSchema, {
      projectId: id,
      taskId: taskId,
      commentId: commentId,
    });
    const deletedComment = await deleteComment(
      idSchema.projectId,
      idSchema.taskId,
      idSchema.commentId,
    );
    return successResponse({ data: deletedComment });
  } catch (error) {
    return handleError(error);
  }
}
