import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  MapIcon, 
  UsersIcon, 
  DocumentTextIcon,
  InboxIcon,
  LogoutIcon,
  UserIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', '3pl_partner'] },
    { name: 'Map View', href: '/map', icon: MapIcon, roles: ['admin'] },
    { name: 'CRM', href: '/crm', icon: UsersIcon, roles: ['admin'] },
    { name: 'Lease Admin', href: '/leases', icon: DocumentTextIcon, roles: ['admin'] },
    { name: 'Client Portal', href: '/portal', icon: UserIcon, roles: ['3pl_partner'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">GROWE</span>
              <span className="ml-2 text-sm text-gray-500">Logistics Platform</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
            
            <Link
              to="/shipper-intake"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-green-700 hover:bg-green-50"
            >
              <InboxIcon className="h-4 w-4 mr-2" />
              Shipper Form
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-700">Welcome, </span>
              <span className="font-medium">{user?.email}</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <LogoutIcon className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;