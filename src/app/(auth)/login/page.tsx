import { requireUnauth } from "@/lib/auth-utils";
import LoginForm from "@/features/auth/components/LoginForm";

export default async function LoginPage() {
  await requireUnauth();

  return <LoginForm />;
}
