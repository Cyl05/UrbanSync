import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaMapMarkerAlt } from 'react-icons/fa';

const MapHeader: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
        <FaMapMarkerAlt className="h-5 w-5 text-indigo-600" />
        <h1 className="text-lg font-bold text-gray-900">UrbanSync</h1>
      </div>

      <div className="flex space-x-2">
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium"
        >
          <FaUserPlus className="h-4 w-4" />
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
};

export default MapHeader;