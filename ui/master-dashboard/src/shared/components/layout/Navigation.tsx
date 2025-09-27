import React from 'react';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">I3M Platform</h1>
          </div>
          <div className="flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-800">Home</a>
            <a href="/about" className="text-gray-600 hover:text-gray-800">About</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-800">Contact</a>
            <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
