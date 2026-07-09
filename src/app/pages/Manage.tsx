import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ShoppingBag, Coffee, Home, Car, Heart, Smartphone, TrendingUp, Plus, Target, Calendar } from 'lucide-react';

export function Manage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'expenses' | 'savings'>('budget');

  const budgetData = [
    { category: 'Food & Dining', budget: 80000, spent: 52000, icon: Coffee, color: '#3b82f6' },
    { category: 'Transport', budget: 40000, spent: 38000, icon: Car, color: '#8b5cf6' },
    { category: 'Shopping', budget: 60000, spent: 45000, icon: ShoppingBag, color: '#10b981' },
    { category: 'Bills & Utilities', budget: 50000, spent: 50000, icon: Home, color: '#f59e0b' },
    { category: 'Healthcare', budget: 30000, spent: 15000, icon: Heart, color: '#ef4444' },
    { category: 'Mobile & Data', budget: 20000, spent: 18000, icon: Smartphone, color: '#06b6d4' },
  ];

  const expensesByCategory = budgetData.map(item => ({
    name: item.category,
    value: item.spent,
    color: item.color
  }));

  const transactions = [
    { id: 1, category: 'Food & Dining', merchant: 'Simba Supermarket', amount: -12000, date: '2026-04-24', icon: Coffee },
    { id: 2, category: 'Transport', merchant: 'Yego Moto', amount: -3000, date: '2026-04-24', icon: Car },
    { id: 3, category: 'Shopping', merchant: 'Kigali City Market', amount: -8000, date: '2026-04-23', icon: ShoppingBag },
    { id: 4, category: 'Bills & Utilities', merchant: 'EUCL (Electricity)', amount: -15000, date: '2026-04-22', icon: Home },
    { id: 5, category: 'Mobile & Data', merchant: 'MTN Rwanda', amount: -5000, date: '2026-04-22', icon: Smartphone },
    { id: 6, category: 'Food & Dining', merchant: 'Bourbon Coffee', amount: -4500, date: '2026-04-21', icon: Coffee },
    { id: 7, category: 'Healthcare', merchant: 'King Faisal Hospital', amount: -10000, date: '2026-04-20', icon: Heart },
  ];

  const savingsGoals = [
    { id: 1, name: 'Emergency Fund', target: 100000, current: 75000, deadline: '2026-06-30', icon: '🛡️', color: 'blue' },
    { id: 2, name: 'School Fees', target: 200000, current: 120000, deadline: '2026-09-01', icon: '🎓', color: 'purple' },
    { id: 3, name: 'Business Inventory', target: 150000, current: 45000, deadline: '2026-07-15', icon: '📦', color: 'green' },
    { id: 4, name: 'New Phone', target: 80000, current: 32000, deadline: '2026-08-01', icon: '📱', color: 'orange' },
  ];

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const budgetRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Finance Management</h1>
        <p className="text-gray-600">Track your spending, manage budgets, and achieve your savings goals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Monthly Budget</p>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">RWF {totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Spent</p>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">RWF {totalSpent.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{((totalSpent / totalBudget) * 100).toFixed(0)}% of budget</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Remaining</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">RWF {budgetRemaining.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{((budgetRemaining / totalBudget) * 100).toFixed(0)}% left</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab('budget')}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                activeTab === 'budget'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Budget Overview
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                activeTab === 'expenses'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Expense Tracking
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                activeTab === 'savings'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Savings Goals
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Budget Overview Tab */}
          {activeTab === 'budget' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Budget Categories</h3>
                <div className="space-y-4">
                  {budgetData.map((item) => {
                    const IconComponent = item.icon;
                    const percentage = (item.spent / item.budget) * 100;
                    const isOverBudget = percentage > 100;

                    return (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                            <span className="text-sm font-medium text-gray-900">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              RWF {item.spent.toLocaleString()} / {item.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {percentage.toFixed(0)}% used
                          {isOverBudget && ' - Over budget!'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Budget Category
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Spending Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> You're spending most on Food & Dining. Consider meal planning
                    to reduce costs by up to 30%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expense Tracking Tab */}
          {activeTab === 'expenses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Filter by Date
                </button>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const IconComponent = transaction.icon;
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.merchant}</p>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          RWF {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Daily Average</p>
                  <p className="text-2xl font-bold text-blue-600">RWF 8,500</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">RWF 42,500</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-green-600">RWF 218,000</p>
                </div>
              </div>
            </div>
          )}

          {/* Savings Goals Tab */}
          {activeTab === 'savings' && (
            <div>
              <div className="grid md:grid-cols-2 gap-6">
                {savingsGoals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  const remaining = goal.target - goal.current;

                  return (
                    <div key={goal.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{goal.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                            <p className="text-sm text-gray-500">Target: {goal.deadline}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="text-xl font-bold text-blue-600">{progress.toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${
                              goal.color === 'blue'
                                ? 'from-blue-500 to-blue-600'
                                : goal.color === 'purple'
                                ? 'from-purple-500 to-purple-600'
                                : goal.color === 'green'
                                ? 'from-green-500 to-green-600'
                                : 'from-orange-500 to-orange-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">
                            RWF {goal.current.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            RWF {goal.target.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Remaining</p>
                          <p className="font-semibold text-gray-900">RWF {remaining.toLocaleString()}</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                          Add Funds
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-medium">Create New Savings Goal</span>
              </button>

              <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3">💡 Savings Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Set up automatic transfers to your savings goals after salary day</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Start small - even RWF 1,000 per day adds up to RWF 30,000 per month</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}