import { 
  FaTachometerAlt, 
  FaFileInvoiceDollar, 
  FaBoxes, 
  FaTags, 
  FaRegAddressBook, 
  FaCog, 
  FaUsers,
  FaSignOutAlt ,
  FaClipboardList ,
  FaMoneyBillWave
} from 'react-icons/fa';


import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-white shadow-md flex flex-col justify-between fixed top-0 left-0 z-50">
      <div>
        {/* Logo */}

        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <span className="text-2xl font-bold text-blue-700 tracking-tight">CoachMe</span>
        </div>
        


        {/* Menu */}
        <nav className="mt-4 px-4 space-y-2 text-sm text-gray-700">


          <Link to="/users" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <FaUsers/>
            <span>Users</span>
          </Link>


          {/* Plans */}
          <Link to="/plans" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <FaFileInvoiceDollar />
            <span>Plans</span>
          </Link>

          {/* Ressources */}
          <Link to="/ressources" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <FaRegAddressBook />
            <span>Ressources</span>
          </Link>

          {/* Catégories */}
          <Link to="/categories" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <FaTags />
            <span>Catégories</span>
          </Link>

          {/* Abonnements */}
          <Link to="/abonnements" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
 
            <  FaClipboardList  />
            <span>Abonnements</span>
          </Link>

          <Link to="/paiements" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            < FaMoneyBillWave />
            <span>paiments</span>
          </Link>
          
        </nav>
      </div>

      {/* Bottom settings */}
      <div className="px-4 py-4 space-y-3 text-sm text-gray-700 border-t">
        <Link to="/settings" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
          <FaCog />
          <span>Settings</span>
        </Link>
        <Link to="/logout" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
          <FaSignOutAlt />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
