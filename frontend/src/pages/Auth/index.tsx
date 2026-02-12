import AuthForm from '@/components/auth/AuthForm';
import AuthRightPanel from '@/components/auth/AuthLeftPanel';
import { Wallet } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side */}
      <div className="relative flex flex-col justify-center items-center px-6 py-12">
        {/* Logo / Brand */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-orange-600">MyBudget</h1>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md p-8 ">
          <AuthForm />
        </div>
      </div>

      {/* Right side */}
      <AuthRightPanel />
    </div>
  );
}
