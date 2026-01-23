import AuthForm from '@/components/auth/AuthForm';
import AuthLeftPanel from '@/components/auth/AuthLeftPanel';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />
      <div className="flex w-full md:w-1/2 justify-center items-center p-10">
        <AuthForm />
      </div>
    </div>
  );
}
