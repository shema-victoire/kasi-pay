import { Outlet, NavLink } from 'react-router-dom';
import { Home, Send, CreditCard, PieChart, BookOpen, User, Wallet, Bell, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: '/app', icon: Home, label: 'Dashboard' },
    { to: '/app/payment', icon: Send, label: 'Payment' },
    { to: '/app/credit', icon: CreditCard, label: 'Credit' },
    { to: '/app/manage', icon: PieChart, label: 'Manage' },
    { to: '/app/learn', icon: BookOpen, label: 'Learn' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 kp-gradient-soft rounded-lg flex items-center justify-center shadow-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white" style={{ color: 'var(--kp-green-mid)' }}>KASI PAY</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">INSTAPAY</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  style={(({ isActive }) => ({
                    backgroundColor: isActive
                      ? 'rgba(127, 184, 148, 0.1)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--kp-green-mid)'
                      : undefined
                  })) as any}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all kp-hover-lift ${
                      isActive
                        ? 'font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--kp-green-mid)' }}></span>
              </button>
              <NavLink
                to="/app/profile"
                style={(({ isActive }) => ({
                  backgroundColor: isActive
                    ? 'rgba(127, 184, 148, 0.1)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--kp-green-mid)'
                    : undefined
                })) as any}
                className={({ isActive }) =>
                  `p-2 rounded-lg transition ${
                    isActive
                      ? ''
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <User className="w-5 h-5" />
              </NavLink>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-lime-50 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
