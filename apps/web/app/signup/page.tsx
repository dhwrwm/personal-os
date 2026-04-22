import AuthForm from "@/modules/auth/components/AuthForm";
import { redirectIfAuthenticated } from "@/lib/auth-session";

export default async function SignupPage() {
  await redirectIfAuthenticated("/");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] px-6 py-16">
      <AuthForm mode="signup" />
    </main>
  );
}
