import { getCurrentUser } from "@/backend/auth";
import AuthEntry from "@/frontend/components/auth/auth-entry";


export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return <AuthEntry />;
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
    </div>
  );
}