import { cookies } from "next/headers";
import { config } from "@/config";

export async function setSessionCookie(sessionId: string) {
  (await cookies()).set( {
    name: "sessionId",
    value: sessionId,
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionCookie(){
    return (await cookies()).get("sessionId")?.value ?? null;
}

export async function clearSessionCookie(){
    (await cookies()).delete("sessionId")
}