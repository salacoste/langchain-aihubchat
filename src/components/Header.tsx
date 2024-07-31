"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo_header.png" alt="Logo" className="h-12 w-12 mr-3" />

          <h1 className="text-xl font-bold text-white">AI Model Selector</h1>
        </div>
        <button
          className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;
