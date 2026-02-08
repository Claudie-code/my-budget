import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import { PrivateRoute } from './components/auth/PrivateRoute';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
