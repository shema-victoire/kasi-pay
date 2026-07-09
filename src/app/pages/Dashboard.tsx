import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, CreditCard, Target, Award, ChevronRight } from 'lucide-react';
import { AccountAggregation } from '../components/AccountAggregation';

export function Dashboard() {
  const recentTransactions = [
    { id: 1, type: 'sent', recipient: 'MTN Mobile Money', amount: -5000, date: '2026-04-24', category: 'Transfer' },
    { id: 2, type: 'received', recipient: 'Salary Payment', amount: 150000, date: '2026-04-20', category: 'Income' },
    { id: 3, type: 'sent', recipient: 'Airtel Airtime', amount: -2000, date: '2026-04-19', category: 'Utilities' },
    { id: 4, type: 'sent', recipient: 'Supermarket', amount: -12000, date: '2026-04-18', category: 'Shopping' },
    { id: 5, type: 'received', recipient: 'Customer Payment', amount: 25000, date: '2026-04-17', category: 'Business' },
  ];

  const savingsGoals = [
    { id: 1, name: 'Emergency Fund', current: 75000, target: 100000, color: 'blue' },
    { id: 2, name: 'School Fees', current: 120000, target: 200000, color: 'purple' },
    { id: 3, name: 'Business Inventory', current: 45000, target: 150000, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="kp-gradient-primary rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 kp-text-on-gradient">Welcome back, Jean!</h2>
            <p className="text-white/90">Here's your financial overview for today</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
            <p className="text-xs text-white/80">Credit Score</p>
            <p className="text-2xl font-bold kp-text-on-gradient">742</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-white/90" />
              <p className="text-sm text-white/80">Available Balance</p>
            </div>
            <p className="text-3xl font-bold kp-text-on-gradient">RWF 284,500</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-white/90" />
              <p className="text-sm text-white/80">This Month</p>
            </div>
            <p className="text-3xl font-bold kp-text-on-gradient">+RWF 156,000</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-white/90" />
              <p className="text-sm text-white/80">Savings Goals</p>
            </div>
            <p className="text-3xl font-bold kp-text-on-gradient">3 Active</p>
          </div>
        </div>
      </div>

      {/* Account Aggregation */}
      <AccountAggregation />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/payment"
          className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group"
          style={{ '--tw-shadow-color': 'rgba(74, 140, 94, 0.1)' } as any}
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Send Money</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Quick transfer</p>
        </Link>

        <Link
          to="/credit"
          className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group"
          style={{ '--tw-shadow-color': 'rgba(74, 140, 94, 0.1)' } as any}
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get Credit</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Apply for loan</p>
        </Link>

        <Link
          to="/manage"
          className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group"
          style={{ '--tw-shadow-color': 'rgba(74, 140, 94, 0.1)' } as any}
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget & savings</p>
        </Link>

        <Link
          to="/learn"
          className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group"
          style={{ '--tw-shadow-color': 'rgba(74, 140, 94, 0.1)' } as any}
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Learn</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Financial tips</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <Link to="/manage" className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--kp-green-mid)' }}>
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'received' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'received' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.recipient}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}RWF {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h3>
            <Link to="/manage" className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--kp-green-mid)' }}>
              Manage
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-5">
            {savingsGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {progress.toFixed(0)}%
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full kp-gradient-soft"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      RWF {goal.current.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      RWF {goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-lime-500 dark:hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition">
            + Create New Goal
          </button>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Financial Health</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg kp-success">
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--kp-green-mid)' }}>742</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Credit Score</p>
            <p className="text-xs mt-1" style={{ color: 'var(--kp-green-dark)' }}>+15 this month</p>
          </div>
          <div className="text-center p-4 rounded-lg kp-success">
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--kp-green-mid)' }}>85%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Payment Reliability</p>
            <p className="text-xs mt-1" style={{ color: 'var(--kp-green-dark)' }}>Excellent</p>
          </div>
          <div className="text-center p-4 rounded-lg kp-success">
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--kp-green-mid)' }}>65%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
            <p className="text-xs mt-1" style={{ color: 'var(--kp-green-dark)' }}>Above average</p>
          </div>
          <div className="text-center p-4 rounded-lg kp-info">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">12</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Days</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
}