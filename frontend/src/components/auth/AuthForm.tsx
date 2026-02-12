import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div>
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}

      <div className="text-center">
        {mode === 'login' ? (
          <p>
            Don’t have an account?{' '}
            <button
              className="text-orange-500 hover:underline font-semibold"
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              className="text-orange-500 hover:underline font-semibold"
              onClick={() => setMode('login')}
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
