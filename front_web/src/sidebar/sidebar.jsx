// import { 
//   FaTachometerAlt, 
//   FaFileInvoiceDollar, 
//   FaBoxes, 
//   FaTags, 
//   FaRegAddressBook, 
//   FaCog, 
//   FaUsers,
//   FaSignOutAlt ,
//   FaClipboardList ,
//   FaMoneyBillWave ,
//   FaBullseye,       // Pour Objectifs
//   FaCommentDots     // Pour Feedbacks
// } from 'react-icons/fa';


// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <div className="w-60 h-screen bg-white shadow-md flex flex-col justify-between fixed top-0 left-0 z-50">
//       <div>
//         {/* Logo */}

//         <div className="flex items-center justify-center h-20 border-b border-gray-100">
//           <span className="text-2xl font-bold text-blue-700 tracking-tight">CoachMe</span>
//         </div>
        


//         {/* Menu */}
//         <nav className="mt-4 px-4 space-y-2 text-sm text-gray-700">


//           <Link to="/users" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             <FaUsers/>
//             <span>Users</span>
//           </Link>


//           {/* Plans */}
//           <Link to="/plans" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             <FaFileInvoiceDollar />
//             <span>Plans</span>
//           </Link>

//           {/* Ressources */}
//           <Link to="/ressources" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             <FaRegAddressBook />
//             <span>Ressources</span>
//           </Link>

//           {/* Catégories */}
//           <Link to="/categories" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             <FaTags />
//             <span>Catégories</span>
//           </Link>

//           {/* Abonnements */}
//           <Link to="/abonnements" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
 
//             <  FaClipboardList  />
//             <span>Abonnements</span>
//           </Link>

//           <Link to="/paiements" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             < FaMoneyBillWave />
//             <span>paiments</span>
//           </Link>


//           {/* ✅ Objectifs */}
//           <Link to="/objectifs" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             <FaBullseye />
//             <span>Objectifs</span>
//           </Link>

//           {/* ✅ Feedbacks */}
//           <Link to="/feedbacks" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//             <FaCommentDots />
//             <span>Feedbacks</span>
//           </Link>
          
//         </nav>
//       </div>

//       {/* Bottom settings */}
//       <div className="px-4 py-4 space-y-3 text-sm text-gray-700 border-t">
//         <Link to="/settings" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//           <FaCog />
//           <span>Settings</span>
//         </Link>
//         <Link to="/logout" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
//           <FaSignOutAlt />
//           <span>Logout</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;









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
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">CoachMe</span>
      </div>

      {/* Menu */}
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
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom settings */}
      <div className="px-4 py-4 space-y-3 text-base text-gray-700 border-t border-gray-100">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/settings'
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100'
          }`}
        >
          <FaCog />
          Settings
        </Link>
        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

