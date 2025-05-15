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
    <nav className="backdrop-blur-md bg-background/70 shadow-md sticky top-0 z-50 border-b border-muted">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-security-blue rounded-md">
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
                className="text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            {/* Show 'Scanlab' only on mobile */}
            <span className="md:hidden text-xl font-bold tracking-wide text-primary">Scanlab</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition">Dashboard</Link>
            <Link href="/url-scanner" className="text-sm font-medium hover:text-primary transition">URL Scanner</Link>
            <Link href="/file-scanner" className="text-sm font-medium hover:text-primary transition">File Scanner</Link>
            <Link href="/ip-lookup" className="text-sm font-medium hover:text-primary transition">IP Lookup</Link>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className={cn(
                'transition duration-300',
                theme === 'dark'
                  ? 'bg-light-100 bg-opacity-20 text-white backdrop-blur-md'
                  : 'bg-dark-900 bg-opacity-20 text-black backdrop-blur-md'
              )}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Mobile Menu Toggle */}
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
                className={cn('w-6 h-6 transition-opacity', { 'opacity-0': isMobileMenuOpen })}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn('absolute w-6 h-6 transition-opacity', {
                  'opacity-100': isMobileMenuOpen,
                  'opacity-0': !isMobileMenuOpen,
                })}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
      )}>
        <div className="px-4 pt-2 pb-4 space-y-2">
          {['Dashboard', 'URL Scanner', 'File Scanner', 'IP Lookup'].map((item, idx) => (
            <Link
              key={idx}
              href={`/${item.toLowerCase().replace(/\s+/g, '-') === 'dashboard' ? '' : item.toLowerCase().replace(/\s+/g, '-')}`}
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary/10 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
