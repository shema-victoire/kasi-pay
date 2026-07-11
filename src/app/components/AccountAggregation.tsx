import { Eye, EyeOff, TrendingUp, TrendingDown, Building2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface LinkedAccount {
  id: string;
  provider_name: string;
  account_type: string;
  account_number_masked: string | null;
  balance: number;
  last_change: number;
  icon: string | null;
}

const ICON_OPTIONS = ['🏦', '🏛️', '📱', '📲', '💰'];

export function AccountAggregation() {
  const { user } = useAuth();
  const [showBalances, setShowBalances] = useState(true);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [providerName, setProviderName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');

  const loadAccounts = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('linked_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at');
    setAccounts((data as LinkedAccount[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddAccount = async () => {
    if (!user || !providerName || !accountType || !balance) return;
    const icon = ICON_OPTIONS[accounts.length % ICON_OPTIONS.length];
    const { error } = await supabase.from('linked_accounts').insert({
      user_id: user.id,
      provider_name: providerName,
      account_type: accountType,
      balance: Number(balance),
      last_change: 0,
      icon,
    });
    if (!error) {
      setProviderName('');
      setAccountType('');
      setBalance('');
      setShowAdd(false);
      loadAccounts();
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const totalChange = accounts.reduce((sum, a) => sum + Number(a.last_change), 0);
  const totalChangePercent =
    totalBalance - totalChange !== 0 ? (totalChange / (totalBalance - totalChange)) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500">
        Loading accounts…
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-lime-400 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Account Aggregation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your accounts, entered manually. No live bank connection yet.
          </p>
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
          {accounts.length > 0 && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                totalChange >= 0 ? 'bg-white/20 text-white' : 'bg-white/15 text-white/90'
              }`}
            >
              {totalChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Account List */}
      {accounts.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No accounts added yet.</p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-transparent dark:border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-700">
                    {account.icon || '🏦'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{account.provider_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.account_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: 'var(--kp-green-mid)' }}>
                    {showBalances ? `RWF ${Number(account.balance).toLocaleString()}` : '••••••'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd ? (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Provider name (e.g. Bank of Kigali, MTN Mobile Money)"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Account type (e.g. Savings, Mobile Wallet)"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Current balance (RWF)"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button onClick={handleAddAccount} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Save
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-lime-500 hover:text-lime-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-lime-400">{accounts.length}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Accounts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {accounts.filter((a) => Number(a.last_change) > 0).length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Growing</p>
        </div>
      </div>
    </div>
  );
}
