import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from '../LoginForm';

const queryClient = new QueryClient();

function renderWithQueryClient(ui: React.ReactElement) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

test('shows validation errors when submitting empty form', async () => {
  renderWithQueryClient(<LoginForm />);
  userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
  expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
});

test('updates input fields correctly', async () => {
  renderWithQueryClient(<LoginForm />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password123');

  expect(emailInput).toHaveValue('test@example.com');
  expect(passwordInput).toHaveValue('password123');
});
