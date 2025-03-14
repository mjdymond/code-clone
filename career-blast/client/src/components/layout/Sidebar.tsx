import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'home' },
    { name: 'Resumes', path: '/resumes', icon: 'file-text' },
    { name: 'Jobs', path: '/jobs', icon: 'briefcase' },
    { name: 'Analyses', path: '/analyses', icon: 'bar-chart' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-grow flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <span className="text-lg font-semibold text-gray-900">Navigation</span>
        </div>
        <nav className="mt-5 flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
