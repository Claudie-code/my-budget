import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterForm from '../RegisterForm';
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

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  test('shows validation errors when submitting empty form', async () => {
    renderWithQueryClient(<RegisterForm />);
    userEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Confirm password is required/i)).toBeInTheDocument();
  });

  test('updates input fields correctly', async () => {
    renderWithQueryClient(<RegisterForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmInput).toHaveValue('password123');
  });

  test('registers successfully and stores token', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-register-token' }),
    });

    renderWithQueryClient(<RegisterForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmInput, 'password123');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-register-token');
    });
  });

  test('shows error message on failed registration', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' }),
    });

    renderWithQueryClient(<RegisterForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmInput, 'password123');
    userEvent.click(submitButton);

    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });
});
