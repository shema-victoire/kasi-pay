import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Bell, CreditCard, Lock, LogOut, Edit2, Camera, Star, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface LinkedAccount {
  id: string;
  provider_name: string;
  account_type: string;
  balance: number;
  is_primary: boolean;
  icon: string | null;
}

interface NotificationPrefs {
  payment_notifications: boolean;
  credit_score_updates: boolean;
  budget_alerts: boolean;
  savings_goals: boolean;
  learning_reminders: boolean;
  promotional_offers: boolean;
  security_alerts: boolean;
}

const PREF_LABELS: { key: keyof NotificationPrefs; title: string; description: string }[] = [
  { key: 'payment_notifications', title: 'Payment Notifications', description: 'Alerts for incoming and outgoing payments' },
  { key: 'credit_score_updates', title: 'Credit Score Updates', description: 'Changes to your credit score' },
  { key: 'budget_alerts', title: 'Budget Alerts', description: 'When you exceed budget limits' },
  { key: 'savings_goals', title: 'Savings Goals', description: 'Progress updates on your goals' },
  { key: 'learning_reminders', title: 'Learning Reminders', description: 'Reminders to continue learning modules' },
  { key: 'promotional_offers', title: 'Promotional Offers', description: 'Special offers and promotions' },
  { key: 'security_alerts', title: 'Security Alerts', description: 'Login and account security notifications' },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'linked'>('profile');
  const { user, profile, signOut, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newProvider, setNewProvider] = useState('');
  const [newAccountType, setNewAccountType] = useState('');
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
      setLanguage(profile.language ?? 'en');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from('notification_preferences').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setPrefs(data as NotificationPrefs); });
    loadLinkedAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadLinkedAccounts = async () => {
    if (!user) return;
    const { data } = await supabase.from('linked_accounts').select('*').eq('user_id', user.id).order('created_at');
    setLinkedAccounts((data as LinkedAccount[]) ?? []);
  };

  const initials = (fullName || profile?.full_name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, language, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    setSaving(false);
    setSaveMessage(error ? `Error: ${error.message}` : 'Saved');
    if (!error) await refreshProfile();
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    if (newPassword.length < 6) {
      setPasswordMessage('Error: password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Error: passwords don't match");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    setPasswordMessage(error ? `Error: ${error.message}` : 'Password updated');
    if (!error) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    setDeleteError(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const { data, error } = await supabase.functions.invoke('delete-account', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleting(false);
    if (error || data?.error) {
      setDeleteError(error?.message || data?.error || 'Failed to delete account');
      return;
    }
    await signOut();
  };

  const togglePref = async (key: keyof NotificationPrefs) => {
    if (!user || !prefs) return;
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    await supabase
      .from('notification_preferences')
      .update({ [key]: updated[key], updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  };

  const handleSetPrimary = async (accountId: string) => {
    if (!user) return;
    await supabase.from('linked_accounts').update({ is_primary: false }).eq('user_id', user.id);
    await supabase.from('linked_accounts').update({ is_primary: true }).eq('id', accountId);
    loadLinkedAccounts();
  };

  const handleRemoveAccount = async (accountId: string) => {
    await supabase.from('linked_accounts').delete().eq('id', accountId);
    loadLinkedAccounts();
  };

  const handleAddAccount = async () => {
    if (!user || !newProvider || !newAccountType || !newBalance) return;
    await supabase.from('linked_accounts').insert({
      user_id: user.id,
      provider_name: newProvider,
      account_type: newAccountType,
      balance: Number(newBalance),
      is_primary: linkedAccounts.length === 0,
      icon: '🏦',
    });
    setNewProvider('');
    setNewAccountType('');
    setNewBalance('');
    setShowAddAccount(false);
    loadLinkedAccounts();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile and account preferences</p>
      </div>

      {/* Profile Header Card */}
      <div className="kp-gradient-primary rounded-2xl p-4 sm:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-50 transition shadow-md">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold mb-1">{profile?.full_name || 'Complete your profile'}</h2>
            <p className="text-blue-100 mb-3">{user?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                {profile?.member_since ? `Member since ${new Date(profile.member_since).getFullYear()}` : 'New member'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-sm text-blue-100 mb-1">Credit Score</p>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs text-blue-100 mt-1">Not yet calculated</p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex gap-2 p-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 py-3 px-4 rounded-lg transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 py-3 px-4 rounded-lg transition ${activeTab === 'security' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 py-3 px-4 rounded-lg transition ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('linked')}
              className={`flex items-center gap-2 py-3 px-4 rounded-lg transition ${activeTab === 'linked' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}
            >
              <CreditCard className="w-4 h-4" />
              Linked Accounts
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="flex gap-2">
                      <Mail className="w-5 h-5 text-gray-400 mt-3" />
                      <input
                        type="email"
                        value={user?.email ?? ''}
                        disabled
                        title="Email is tied to your login and can't be changed here"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <div className="flex gap-2">
                      <Phone className="w-5 h-5 text-gray-400 mt-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+250 788 123 456"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="en">English</option>
                      <option value="rw">Kinyarwanda</option>
                      <option value="fr">Français</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </div>
                </div>
              </div>

              {saveMessage && (
                <p className={`text-sm ${saveMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{saveMessage}</p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {passwordMessage && (
                    <p className={`text-sm ${passwordMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage}</p>
                  )}
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {changingPassword ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Danger Zone
                </h4>
                <p className="text-sm text-red-700 mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
              {!prefs ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
              ) : (
                <div className="space-y-3">
                  {PREF_LABELS.map(({ key, title, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prefs[key]}
                          onChange={() => togglePref(key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:border-gray-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Linked Accounts Tab */}
          {activeTab === 'linked' && (
            <div className="max-w-2xl space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Linked Payment Accounts</h3>

              {linkedAccounts.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No accounts linked yet.</p>
              ) : (
                <div className="space-y-4">
                  {linkedAccounts.map((acc) => (
                    <div key={acc.id} className={`p-4 border-2 rounded-lg ${acc.is_primary ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40' : 'border-gray-200 dark:border-gray-800'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-200 dark:border-gray-800">
                            {acc.icon || '🏦'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{acc.provider_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{acc.account_type} · RWF {Number(acc.balance).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {acc.is_primary ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-current" /> Primary
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimary(acc.id)}
                              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              Set as Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveAccount(acc.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddAccount ? (
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Provider name (e.g. MTN Mobile Money)"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Account type (e.g. Mobile Wallet, Savings)"
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Current balance (RWF)"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddAccount} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                      Save
                    </button>
                    <button onClick={() => setShowAddAccount(false)} className="flex-1 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Link New Account</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Sign Out</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sign out from your KASI PAY account</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-900 mb-3">Delete your account?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This permanently deletes your account and everything tied to it: budgets, transactions, savings goals,
              credit score history, loans, and payment history. This cannot be undone.
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Type <strong>DELETE</strong> to confirm:</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            {deleteError && <p className="text-sm text-red-600 mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Permanently Delete'}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeleteError(null); }}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-900 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
