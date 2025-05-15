'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileCheck, Home, Network, Search, Shield } from 'lucide-react';

const sidebarItems = [
  {
    name: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/',
  },
  {
    name: 'URL Scanner',
    icon: <Search className="h-5 w-5" />,
    path: '/UrlScanner',
  },
  {
    name: 'File Scanner',
    icon: <FileCheck className="h-5 w-5" />,
    path: '/file-scanner',
  },
  {
    name: 'IP Lookup',
    icon: <Network className="h-5 w-5" />,
    path: '/ip-lookup',
  },
  
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-sidebar">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6 shrink-0">
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
          <span className="font-bold text-3xl">Scanlab</span>

        </Link>
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent',
                  pathname === item.path && 'bg-primary/10 text-primary'
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4 shrink-0">
        <div className="frosted-glass flex items-center space-x-3 p-4 rounded-lg">
          <div className="p-2 bg-security-blue rounded-full">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Free Plan</p>
            <p className="text-xs text-muted-foreground">500 scans/month</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
