
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">PASSWORD</span>
          <div className="w-6 h-6 bg-purple-light"></div>
          <span className="text-xl font-bold">LINK</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-light">About</Link>
          <Link to="/" className="hover:text-purple-light">Plans</Link>
          <Link to="/" className="hover:text-purple-light">FAQ</Link>
          <Link to="/" className="hover:text-purple-light">Custom solution</Link>
          <Link to="/" className="hover:text-purple-light">News</Link>
          <Link to="/" className="hover:text-purple-light">Support</Link>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-gray-800 text-white px-4 py-1 rounded-md flex items-center space-x-1">
            <span>Log in</span>
          </button>
          <button className="bg-purple-dark text-white px-4 py-1 rounded-md flex items-center space-x-1">
            <span>Create account</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
