import apiClient from "../lib/api-client";

import type {RegisterInput, SignInInput} from "@/frontend/types/auth";

export async function logIn(input: SignInInput): Promise<string> {
  return apiClient.post<string>("/api/auth/login", input);
}

export async function register(input: RegisterInput): Promise<string> {
  return apiClient.post<string>("/api/auth/register", input);
}

