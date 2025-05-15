'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="frosted-glass sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-security-blue rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <span className="hidden md:inline-block font-semibold text-xl">SecureScan</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link href="/UrlScanner" className="text-sm font-medium hover:text-primary">URL Scanner</Link>
            <Link href="/file-scanner" className="text-sm font-medium hover:text-primary">File Scanner</Link>
            <Link href="/ip-lookup" className="text-sm font-medium hover:text-primary">IP Lookup</Link>
            
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Toggle theme" 
              onClick={toggleTheme}
              className={cn(
                'transition-all duration-300',
                theme === 'dark' ? 'bg-light-100 bg-opacity-30 text-dark-900 backdrop-blur-md' : 'bg-dark-900 bg-opacity-30 text-light-100 backdrop-blur-md'
              )}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {/* Hamburger Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('transition-all', {
                  'opacity-0': isMobileMenuOpen,
                  'opacity-100': !isMobileMenuOpen,
                })}
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>

              {/* X Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('absolute transition-all', {
                  'opacity-100': isMobileMenuOpen,
                  'opacity-0': !isMobileMenuOpen,
                })}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary/10" onClick={() => setIsMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/url-scanner" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary/10" onClick={() => setIsMobileMenuOpen(false)}>
            URL Scanner
          </Link>
          <Link href="/file-scanner" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary/10" onClick={() => setIsMobileMenuOpen(false)}>
            File Scanner
          </Link>
          <Link href="/ip-lookup" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary/10" onClick={() => setIsMobileMenuOpen(false)}>
            IP Lookup
          </Link>
          <Link href="/scan-history" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary/10" onClick={() => setIsMobileMenuOpen(false)}>
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
