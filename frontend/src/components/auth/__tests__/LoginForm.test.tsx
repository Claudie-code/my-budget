import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from '../LoginForm';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';

const queryClient = new QueryClient();

function renderWithQueryClient(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

const fetchMock = vi.fn();

globalThis.fetch = fetchMock as unknown as typeof fetch;

describe('LoginForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

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

  test('stores token and invalidates currentUser query on successful login', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' }),
    });

    renderWithQueryClient(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
    });
  });

  test('shows error message on failed login', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    renderWithQueryClient(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpass');
    userEvent.click(submitButton);

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
