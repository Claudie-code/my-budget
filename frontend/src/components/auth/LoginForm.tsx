import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '../ui/card';
import { loginSchema } from '@/schemas/auth.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useLogin } from '@/hooks/use-login';

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const { mutate, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parseResult = loginSchema.safeParse(form);
    if (!parseResult.success) {
      const fieldErrors: Partial<LoginFormState> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as keyof LoginFormState] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutate(parseResult.data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: () => {
        setErrors({ password: 'Invalid email or password' });
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Account Information</FieldLegend>
              <FieldDescription>Enter your credentials to log in</FieldDescription>

              <FieldGroup>
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
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <Field orientation="horizontal">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 text-white w-full"
                disabled={isPending}
              >
                {isPending ? 'Signing in...' : 'Submit'}
              </Button>
            </Field>
            <p className="text-sm text-red-500 mt-2">
              {isError && error instanceof Error && error.message}
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
