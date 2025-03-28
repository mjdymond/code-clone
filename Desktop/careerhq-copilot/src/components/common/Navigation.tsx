'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useStore } from '@/lib/store';
import { ConnectionStatus } from './ConnectionStatus';
import { FileText, Briefcase, MessageSquare, DollarSign, Menu, X, CpuIcon, Bug, Users, Layers } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isConnected = useStore(state => state.isConnected);
  const taskRegistry = useStore(state => state.taskRegistry);
  
  // Only show debug in development
  const [showDebug, setShowDebug] = useState(false);
  
  // Use useEffect to update client-side only state
  useEffect(() => {
    setShowDebug(true);
  }, []);
  
  const navigationItems = [
    {
      name: 'Resume',
      href: '/resume',
      icon: FileText,
      current: pathname === '/resume',
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      current: pathname === '/jobs',
    },
    {
      name: 'Demo',
      href: '/demo',
      icon: Layers,
      current: pathname === '/demo' || pathname.startsWith('/demo/'),
    },
    {
      name: 'Agents',
      href: '/agents',
      icon: Users,
      current: pathname === '/agents',
    },
    {
      name: 'Interview',
      href: '/interview',
      icon: MessageSquare,
      current: pathname === '/interview',
      disabled: true,
    },
    {
      name: 'Salary',
      href: '/salary',
      icon: DollarSign,
      current: pathname === '/salary',
      disabled: true,
    },
  ];
  
  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <CpuIcon className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-semibold text-gray-900">CareerHQ</span>
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.disabled ? '#' : item.href}
                    className={`
                      inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16
                      ${item.current 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-1.5" />
                    {item.name}
                    {item.disabled && (
                      <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded">
                        Coming Soon
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center space-x-4">
                {showDebug && (
                  <Link 
                    href="/debug" 
                    className={`inline-flex items-center px-3 py-1.5 text-sm border rounded-md ${pathname === '/debug' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Bug className="h-4 w-4 mr-1.5" />
                    Debug
                  </Link>
                )}
                <ConnectionStatus />
                
                {taskRegistry && taskRegistry.overall_completion > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Workflow Progress:</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${taskRegistry.overall_completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{taskRegistry.overall_completion}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={`
                  flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium
                  ${item.current
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                {item.disabled && (
                  <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded">
                    Coming Soon
                  </span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 px-4">
              <ConnectionStatus />
              
              {showDebug && (
                <Link 
                  href="/debug" 
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${pathname === '/debug' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Debug Tools
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
