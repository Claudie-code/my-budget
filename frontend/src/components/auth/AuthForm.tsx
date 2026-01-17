import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md">
      {mode === "login" ? <LoginForm /> : <RegisterForm />}

      <div className="text-center mt-4">
        {mode === "login" ? (
          <p>
            Don’t have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
