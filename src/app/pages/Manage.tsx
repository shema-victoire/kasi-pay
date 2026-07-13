import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ShoppingBag, Coffee, Home, Car, Heart, Smartphone, TrendingUp, Plus, Target, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const ICONS: Record<string, any> = {
  'Food & Dining': Coffee,
  Transport: Car,
  Shopping: ShoppingBag,
  'Bills & Utilities': Home,
  Healthcare: Heart,
  'Mobile & Data': Smartphone,
};
const DEFAULT_ICON = Wallet;

const COLOR_PRESETS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

interface Budget {
  id: string;
  category: string;
  monthly_limit: number;
  color: string | null;
}
interface Txn {
  id: string;
  category: string;
  merchant: string;
  amount: number;
  type: 'sent' | 'received';
  occurred_at: string;
}
interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string | null;
}

export function Manage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'budget' | 'expenses' | 'savings'>('budget');
  const [loading, setLoading] = useState(true);

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseMerchant, setExpenseMerchant] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    const [b, t, g] = await Promise.all([
      supabase.from('budgets').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('occurred_at', { ascending: false }).limit(20),
      supabase.from('savings_goals').select('*').eq('user_id', user.id).order('created_at'),
    ]);
    setBudgets((b.data as Budget[]) ?? []);
    setTransactions((t.data as Txn[]) ?? []);
    setGoals((g.data as Goal[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type === 'sent') map[t.category] = (map[t.category] ?? 0) + Math.abs(t.amount);
    }
    return map;
  }, [transactions]);

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.monthly_limit), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (spentByCategory[b.category] ?? 0), 0);
  const budgetRemaining = totalBudget - totalSpent;

  const pieData = budgets
    .map((b) => ({ name: b.category, value: spentByCategory[b.category] ?? 0, color: b.color || '#3b82f6' }))
    .filter((d) => d.value > 0);

  const handleAddBudget = async () => {
    if (!user || !newBudgetCategory || !newBudgetLimit) return;
    const color = COLOR_PRESETS[budgets.length % COLOR_PRESETS.length];
    const { error } = await supabase.from('budgets').insert({
      user_id: user.id,
      category: newBudgetCategory,
      monthly_limit: Number(newBudgetLimit),
      color,
    });
    if (!error) {
      setNewBudgetCategory('');
      setNewBudgetLimit('');
      setShowAddBudget(false);
      loadAll();
    }
  };

  const handleAddExpense = async () => {
    if (!user || !expenseCategory || !expenseMerchant || !expenseAmount) return;
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      category: expenseCategory,
      merchant: expenseMerchant,
      amount: Number(expenseAmount),
      type: 'sent',
      occurred_at: new Date().toISOString(),
    });
    if (!error) {
      setExpenseCategory('');
      setExpenseMerchant('');
      setExpenseAmount('');
      setShowAddExpense(false);
      loadAll();
    }
  };

  const handleAddGoal = async () => {
    if (!user || !goalName || !goalTarget) return;
    const { error } = await supabase.from('savings_goals').insert({
      user_id: user.id,
      name: goalName,
      target_amount: Number(goalTarget),
      current_amount: 0,
      deadline: goalDeadline || null,
      icon: '🎯',
    });
    if (!error) {
      setGoalName('');
      setGoalTarget('');
      setGoalDeadline('');
      setShowAddGoal(false);
      loadAll();
    }
  };

  const handleAddFunds = async (goal: Goal) => {
    const input = window.prompt(`Add how much to "${goal.name}" (RWF)?`);
    if (!input) return;
    const amount = Number(input);
    if (!amount || amount <= 0) return;
    const newAmount = goal.current_amount + amount;
    const { error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount })
      .eq('id', goal.id);
    if (!error) {
      if (goal.current_amount < goal.target_amount && newAmount >= goal.target_amount && user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Savings goal reached',
          body: `"${goal.name}" is fully funded`,
        });
      }
      loadAll();
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading your finances...</div>;
  }

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
          <p className="text-xs text-gray-500 mt-1">
            {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% of budget` : 'No budget set yet'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Remaining</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">RWF {budgetRemaining.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalBudget > 0 ? `${((budgetRemaining / totalBudget) * 100).toFixed(0)}% left` : '—'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab('budget')}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                activeTab === 'budget' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Budget Overview
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                activeTab === 'expenses' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Expense Tracking
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                activeTab === 'savings' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
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
                {budgets.length === 0 && (
                  <p className="text-sm text-gray-500 mb-4">No budget categories yet. Add your first one below.</p>
                )}
                <div className="space-y-4">
                  {budgets.map((item) => {
                    const IconComponent = ICONS[item.category] || DEFAULT_ICON;
                    const spent = spentByCategory[item.category] ?? 0;
                    const percentage = item.monthly_limit > 0 ? (spent / item.monthly_limit) * 100 : 0;
                    const isOverBudget = percentage > 100;

                    return (
                      <div key={item.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" style={{ color: item.color || '#3b82f6' }} />
                            <span className="text-sm font-medium text-gray-900">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              RWF {spent.toLocaleString()} / {Number(item.monthly_limit).toLocaleString()}
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

                {showAddBudget ? (
                  <div className="mt-6 p-4 border border-gray-200 rounded-lg space-y-3">
                    <input
                      type="text"
                      placeholder="Category name (e.g. Food & Dining)"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Monthly limit (RWF)"
                      value={newBudgetLimit}
                      onChange={(e) => setNewBudgetLimit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleAddBudget} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                        Save
                      </button>
                      <button onClick={() => setShowAddBudget(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddBudget(true)}
                    className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Budget Category
                  </button>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `RWF ${v.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-500">No spending recorded yet. Add an expense to see your breakdown.</p>
                )}
              </div>
            </div>
          )}

          {/* Expense Tracking Tab */}
          {activeTab === 'expenses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                <button
                  onClick={() => setShowAddExpense(!showAddExpense)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>

              {showAddExpense && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg space-y-3">
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {budgets.map((b) => (
                      <option key={b.id} value={b.category}>{b.category}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Merchant (e.g. Simba Supermarket)"
                    value={expenseMerchant}
                    onChange={(e) => setExpenseMerchant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount (RWF)"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddExpense} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                      Save
                    </button>
                    <button onClick={() => setShowAddExpense(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {transactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => {
                    const IconComponent = ICONS[transaction.category] || DEFAULT_ICON;
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
                          <p className={`font-semibold ${transaction.type === 'received' ? 'text-green-600' : 'text-gray-900'}`}>
                            {transaction.type === 'received' ? '+' : '-'}RWF {Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(transaction.occurred_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Savings Goals Tab */}
          {activeTab === 'savings' && (
            <div>
              {goals.length === 0 && <p className="text-sm text-gray-500 mb-4">No savings goals yet.</p>}
              <div className="grid md:grid-cols-2 gap-6">
                {goals.map((goal) => {
                  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                  const remaining = goal.target_amount - goal.current_amount;

                  return (
                    <div key={goal.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{goal.icon || '🎯'}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                            <p className="text-sm text-gray-500">
                              {goal.deadline ? `Target: ${goal.deadline}` : 'No deadline set'}
                            </p>
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
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">RWF {goal.current_amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">RWF {goal.target_amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Remaining</p>
                          <p className="font-semibold text-gray-900">RWF {Math.max(remaining, 0).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleAddFunds(goal)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Add Funds
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {showAddGoal ? (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Goal name (e.g. School Fees)"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Target amount (RWF)"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddGoal} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                      Save
                    </button>
                    <button onClick={() => setShowAddGoal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Create New Savings Goal</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
