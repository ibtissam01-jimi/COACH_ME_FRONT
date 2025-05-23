import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { User } from 'lucide-react';

const navItems = [
  { label: 'Utilisateurs', icon: 'mdi:account-group', to: '/users' },
  { label: 'Mon Profil', icon: <User className="w-5 h-5" />, to: '/profile' },
  // Add more nav items here as needed
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col fixed top-0 left-0 z-40">
      <div className="flex items-center justify-center h-20 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">CoachMe</span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors
              ${location.pathname === item.to
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {typeof item.icon === 'string' ? (
              <Icon icon={item.icon} className="text-xl" />
            ) : (
              item.icon
            )}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 