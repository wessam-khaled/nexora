import { hashPassword, verifyPassword } from "@/auth/password"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
       <h1 >Welcome to Nexora</h1>

      </main>
    </div>
  );
}


async function testPassword() {
  const password = "123456";

  const hashedPassword = await hashPassword(password);

  const correct = await verifyPassword(
    password,
    hashedPassword
  );

  const wrong = await verifyPassword(
    "wrong-password",
    hashedPassword
  );

  console.log("Correct password:", correct);
  console.log("Wrong password:", wrong);
}

testPassword();