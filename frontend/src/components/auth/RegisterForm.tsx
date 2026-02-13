import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { registerSchema } from '@/schemas/auth.schema';
import { useNavigate } from 'react-router';
import { useRegister } from '@/hooks/use-register';

interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormState, string>>>({});

  const { mutate, isPending, isError, error } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parseResult = registerSchema.safeParse(form);
    if (!parseResult.success) {
      const fieldErrors: Partial<RegisterFormState> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as keyof RegisterFormState] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutate(parseResult.data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: () => {
        setErrors({ password: 'Registration failed. Please try again.' });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <FieldSet>
          <div>
            <h1 className="text-2xl font-bold mb-1">Create an account</h1>
            <FieldDescription>Fill in your details to register</FieldDescription>
          </div>

          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
                className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              <FieldDescription>Must be at least 8 characters</FieldDescription>
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={
                  errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
                }
              />
              <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
            </Field>
          </div>
        </FieldSet>
      </FieldGroup>
      <Button type="submit" className="w-full mt-7 cursor-pointer" disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
      </Button>
      <p className="text-sm text-red-500 mt-2">
        {isError && error instanceof Error && error.message}
      </p>
    </form>
  );
}
