import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "../ui/card";
import { loginSchema } from "@/schemas/auth.schema";
import { ZodError } from "zod";

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormState, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: LoginFormState = {
        email: form.email,
        password: form.password,
      };
      loginSchema.parse(form);
      setErrors({});

      console.log(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormState, string>> = {};

        error.issues.forEach((e) => {
          const field = e.path[0] as keyof LoginFormState;
          fieldErrors[field] = e.message;
        });

        setErrors(fieldErrors);
        console.log("Validation errors:", fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Account Information</FieldLegend>
              <FieldDescription>
                Enter your credentials to log in
              </FieldDescription>

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
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
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
                    minLength={8}
                  />
                  <FieldDescription>
                    Must be at least 8 characters
                  </FieldDescription>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <Field orientation="horizontal">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 text-white w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Submit"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
