import { useLocation } from 'react-router';

export function PageHeader() {
  const location = useLocation();

  let title = '';
  switch (location.pathname) {
    case '/dashboard':
      title = 'Dashboard';
      break;
    case '/settings':
      title = 'Settings';
      break;
    default:
      title = '';
  }

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    </div>
  );
}
