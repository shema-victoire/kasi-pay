import { Eye, EyeOff, TrendingUp, TrendingDown, Building2, Wallet } from 'lucide-react';
import { useState } from 'react';

export function AccountAggregation() {
  const [showBalances, setShowBalances] = useState(true);

  const accounts = [
    {
      id: 1,
      name: 'Bank of Kigali',
      type: 'Savings Account',
      balance: 1250000,
      change: 45000,
      changePercent: 3.7,
      accountNumber: '**** 1234',
      icon: '🏦',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Equity Bank',
      type: 'Current Account',
      balance: 850000,
      change: -12000,
      changePercent: -1.4,
      accountNumber: '**** 5678',
      icon: '🏛️',
      color: 'red'
    },
    {
      id: 3,
      name: 'MTN Mobile Money',
      type: 'Mobile Wallet',
      balance: 284500,
      change: 15000,
      changePercent: 5.6,
      accountNumber: '**** 3456',
      icon: '📱',
      color: 'yellow'
    },
    {
      id: 4,
      name: 'Airtel Money',
      type: 'Mobile Wallet',
      balance: 125000,
      change: 8000,
      changePercent: 6.8,
      accountNumber: '**** 7890',
      icon: '📲',
      color: 'orange'
    },
    {
      id: 5,
      name: 'I&M Bank',
      type: 'Fixed Deposit',
      balance: 3500000,
      change: 25000,
      changePercent: 0.7,
      accountNumber: '**** 9012',
      icon: '💰',
      color: 'green'
    },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalChange = accounts.reduce((sum, acc) => sum + acc.change, 0);
  const totalChangePercent = (totalChange / (totalBalance - totalChange)) * 100;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-lime-400 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Account Aggregation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All your accounts in one place</p>
        </div>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          {showBalances ? (
            <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="kp-gradient-soft rounded-xl p-6 mb-6 shadow-lg border border-white/20">
        <p className="text-sm text-white/90 mb-2">Total Balance Across All Accounts</p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-4xl font-bold kp-text-on-gradient">
            {showBalances ? `RWF ${totalBalance.toLocaleString()}` : 'RWF ••••••••'}
          </h2>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            totalChange >= 0
              ? 'bg-white/20 text-white'
              : 'bg-white/15 text-white/90'
          }`}>
            {totalChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(1)}%
          </div>
        </div>
        <p className="text-sm text-white/90 mt-2">
          {totalChange >= 0 ? '+' : ''}RWF {Math.abs(totalChange).toLocaleString()} this month
        </p>
      </div>

      {/* Account List */}
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition cursor-pointer border border-transparent dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-700">
                  {account.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{account.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.type}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.accountNumber}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-gray-900 dark:text-white" style={{ color: 'var(--kp-green-mid)' }}>
                  {showBalances ? `RWF ${account.balance.toLocaleString()}` : '••••••'}
                </p>
                <div className={`flex items-center justify-end gap-1 text-sm mt-1 ${
                  account.change >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {account.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {account.change >= 0 ? '+' : ''}RWF {Math.abs(account.change).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-lime-400">{accounts.length}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Accounts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {accounts.filter(a => a.change > 0).length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Growing</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Linked Banks</p>
        </div>
      </div>
    </div>
  );
}