

import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { User } from 'lucide-react';

const navItems = [
  { label: 'Utilisateurs', icon: 'mdi:account-group', to: '/users' },
  { label: 'Mon Profil', icon: <User className="w-5 h-5" />, to: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col fixed top-0 left-0 z-40 font-extralight">
      <div className="flex items-center justify-center h-20 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">CoachMe</span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const baseClasses =
            'group flex items-center gap-3 px-4 py-2 rounded-lg text-base transition-colors';
          const activeClasses = 'bg-blue-500 text-white';
          const defaultClasses = 'text-black hover:bg-blue-500 hover:text-white';

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`${baseClasses} ${isActive ? activeClasses : defaultClasses}`}
            >
              {typeof item.icon === 'string' ? (
                <Icon
                  icon={item.icon}
                  className={`text-xl ${isActive ? 'text-white' : 'text-black group-hover:text-white'}`}
                />
              ) : (
                // Pour les composants comme <User />, on applique les classes dynamiquement :
                <item.icon.type
                  {...item.icon.props}
                  className={`${item.icon.props.className} ${
                    isActive ? 'text-white' : 'text-black group-hover:text-white'
                  }`}
                />
              )}
              <span className={`${isActive ? 'text-white' : 'text-black group-hover:text-white'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
