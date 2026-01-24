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
import { Card, CardContent } from '@/components/ui/card';
import { registerSchema } from '@/schemas/auth.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<RegisterFormState>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormState, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormState) => {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      return res.json() as Promise<{ token: string }>;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/dashboard');
    },
  });

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

    registerMutation.mutate(parseResult.data);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Create an Account</FieldLegend>
              <FieldDescription>Fill in your details to register</FieldDescription>

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
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <Field orientation="horizontal">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 text-white w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Registering...' : 'Register'}
              </Button>
            </Field>
            <p className="text-sm text-red-500 mt-2">
              {registerMutation.isError &&
                registerMutation.error instanceof Error &&
                registerMutation.error.message}
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
