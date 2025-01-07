import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-800">Tutorat</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">
                Apprentis
              </Link>
              <Link to="/entreprises" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">
                Entreprises
              </Link>
              <Link to="/evenements" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">
                Évènements
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600">
              <Bell className="h-6 w-6" />
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;