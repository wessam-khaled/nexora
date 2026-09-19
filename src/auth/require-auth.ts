import { getCurrentUser } from "@/auth/current-user";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES } from "@/constants/error-codes";

export async function requireAuth(){
    const user = await getCurrentUser();
    if (!user) {
        throw new AppError("Unauthorized", 401, ERROR_CODES.UNAUTHORIZED);
    }
    return user;
}