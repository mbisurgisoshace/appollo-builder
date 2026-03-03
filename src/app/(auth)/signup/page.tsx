import { requireUnauth } from "@/lib/auth-utils";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default async function SignupPage() {
  await requireUnauth();

  return <RegisterForm />;
}
