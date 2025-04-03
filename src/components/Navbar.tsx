import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <div className="flex items-center cursor-pointer">
                <span className="text-xl font-bold text-indigo-600">Memórias de Pets</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" passHref>
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              } cursor-pointer transition-colors`}>
                Início
              </div>
            </Link>
            <Link href="/create-memory" passHref>
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/create-memory') 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              } cursor-pointer transition-colors`}>
                Criar Memória
              </div>
            </Link>
            <Link href="/about" passHref>
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/about') 
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              } cursor-pointer transition-colors`}>
                Sobre
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link href="/" passHref>
              <div
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                } cursor-pointer transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </div>
            </Link>
            <Link href="/create-memory" passHref>
              <div
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/create-memory') 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                } cursor-pointer transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Criar Memória
              </div>
            </Link>
            <Link href="/about" passHref>
              <div
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/about') 
                    ? 'text-indigo-700 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                } cursor-pointer transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
