

import { 
  FaFileInvoiceDollar, 
  FaTags, 
  FaRegAddressBook, 
  FaCog, 
  FaUsers,
  FaSignOutAlt,
  FaClipboardList,
  FaMoneyBillWave,
  FaBullseye,
  FaCommentDots
} from 'react-icons/fa';

import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/users', icon: <FaUsers />, label: 'Users' },
    { to: '/plans', icon: <FaFileInvoiceDollar />, label: 'Plans' },
    { to: '/ressources', icon: <FaRegAddressBook />, label: 'Ressources' },
    { to: '/categories', icon: <FaTags />, label: 'Catégories' },
    { to: '/abonnements', icon: <FaClipboardList />, label: 'Abonnements' },
    { to: '/paiements', icon: <FaMoneyBillWave />, label: 'Paiements' },
    { to: '/objectifs', icon: <FaBullseye />, label: 'Objectifs' },
    { to: '/feedbackList', icon: <FaCommentDots />, label: 'Feedbacks' },
  ];

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col fixed top-0 left-0 z-40 font-light">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">CoachMe</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const baseClasses =
            'group flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors';
          const activeClasses = 'bg-blue-500 text-white';
          const defaultClasses = 'bg-white text-black hover:bg-blue-500 hover:text-white';

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`${baseClasses} ${isActive ? activeClasses : defaultClasses}`}
            >
              <span className={`${isActive ? 'text-white' : 'text-black font-normal group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className={`${isActive ? 'text-white' : 'text-black font-normal group-hover:text-white'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom settings */}
      <div className="px-4 py-4 space-y-3 text-base text-gray-700 border-t border-gray-100">
        {/* Settings */}
        <Link
          to="/settings"
          className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
            ${location.pathname === '/settings'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
        >
          <FaCog className={`${location.pathname === '/settings' ? 'text-white' : 'text-black font-normal group-hover:text-white'}`} />
          <span className={`${location.pathname === '/settings' ? 'text-white' : 'text-black font-normal group-hover:text-white'}`}>Settings</span>
        </Link>

        {/* Logout */}
        <Link
          to="/logout"
          className="group flex items-center gap-3 px-4 py-2 rounded-lg bg-white text-black hover:bg-blue-500 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="text-black font-normal group-hover:text-white" />
          <span className="text-black font-normal group-hover:text-white">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

