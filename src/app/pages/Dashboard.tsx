import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, CreditCard, Target, Award, ChevronRight } from 'lucide-react';
import { AccountAggregation } from '../components/AccountAggregation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

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
  current_amount: number;
  target_amount: number;
}

export function Dashboard() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);

      const [accountsRes, txRes, goalsRes] = await Promise.all([
        supabase.from('linked_accounts').select('balance').eq('user_id', user.id),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('occurred_at', { ascending: false })
          .limit(5),
        supabase.from('savings_goals').select('id, name, current_amount, target_amount').eq('user_id', user.id),
      ]);

      const balance = (accountsRes.data ?? []).reduce((sum: number, a: any) => sum + Number(a.balance), 0);
      setTotalBalance(balance);
      setTransactions((txRes.data as Txn[]) ?? []);
      setGoals((goalsRes.data as Goal[]) ?? []);

      // this month's net (received - sent) from full transaction history
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { data: monthTx } = await supabase
        .from('transactions')
        .select('type, amount, occurred_at')
        .eq('user_id', user.id)
        .gte('occurred_at', startOfMonth.toISOString());
      const net = (monthTx ?? []).reduce(
        (sum: number, t: any) => sum + (t.type === 'received' ? Number(t.amount) : -Number(t.amount)),
        0
      );
      setMonthTotal(net);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading your dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="kp-gradient-primary rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 kp-text-on-gradient">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-white/90">Here's your financial overview for today</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
            <p className="text-xs text-white/80">Credit Score</p>
            <p className="text-2xl font-bold kp-text-on-gradient">—</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-white/90" />
              <p className="text-sm text-white/80">Available Balance</p>
            </div>
            <p className="text-3xl font-bold kp-text-on-gradient">RWF {totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-white/90" />
              <p className="text-sm text-white/80">This Month</p>
            </div>
            <p className="text-3xl font-bold kp-text-on-gradient">
              {monthTotal >= 0 ? '+' : ''}RWF {monthTotal.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-white/90" />
              <p className="text-sm text-white/80">Savings Goals</p>
            </div>
            <p className="text-3xl font-bold kp-text-on-gradient">{goals.length} Active</p>
          </div>
        </div>
      </div>

      {/* Account Aggregation */}
      <AccountAggregation />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/payment" className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Send Money</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Quick transfer</p>
        </Link>

        <Link to="/credit" className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get Credit</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Apply for loan</p>
        </Link>

        <Link to="/manage" className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition kp-gradient-subtle">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget & savings</p>
        </Link>

        <Link to="/learn" className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg kp-hover-lift transition group">
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

          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet — add one from the Manage page.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
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
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.merchant}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.occurred_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}RWF {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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

          {goals.length === 0 ? (
            <p className="text-sm text-gray-500">No savings goals yet.</p>
          ) : (
            <div className="space-y-5">
              {goals.map((goal) => {
                const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{progress.toFixed(0)}%</p>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full kp-gradient-soft" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">RWF {goal.current_amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">RWF {goal.target_amount.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            to="/manage"
            className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-lime-500 dark:hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition flex items-center justify-center"
          >
            + Create New Goal
          </Link>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Financial Health</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Full scoring is calculated on the Credit page once you have enough transaction history.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg kp-success">
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--kp-green-mid)' }}>
              {transactions.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recorded Transactions</p>
          </div>
          <div className="text-center p-4 rounded-lg kp-success">
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--kp-green-mid)' }}>
              {goals.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Savings Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
