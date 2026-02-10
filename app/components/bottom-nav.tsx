'use client'

import React from "react"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Send, Clock, Settings } from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

export function BottomNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      icon: <Home size={24} />,
      label: 'Home',
    },
    {
      href: '/send',
      icon: <Send size={24} />,
      label: 'Send',
    },
    {
      href: '/transactions',
      icon: <Clock size={24} />,
      label: 'History',
    },
    {
      href: '/settings',
      icon: <Settings size={24} />,
      label: 'Settings',
    },
  ]

  // Only show bottom nav on main wallet pages
  const showBottomNav = ['/dashboard', '/send', '/transactions', '/settings', '/receive'].includes(pathname)

  if (!showBottomNav) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-gray-700 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition ${
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className={`transition ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
