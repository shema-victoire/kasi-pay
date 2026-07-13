import { useState, useEffect, useCallback } from 'react';
import { PaymentInitiation } from '../components/PaymentInitiation';
import { History, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface PaymentRequest {
  id: string;
  method: 'qr' | 'mobile' | 'ussd';
  provider: string | null;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
}

const METHOD_LABEL: Record<string, string> = {
  qr: 'QR Code',
  mobile: 'Mobile Money',
  ussd: 'USSD',
};

export function Payment() {
  const { user } = useAuth();
  const [history, setHistory] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(25);
    setHistory((data as PaymentRequest[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Initiation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Send money across multiple channels. Sandbox mode, no real funds move yet
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Interface */}
        <div className="lg:col-span-2">
          <PaymentInitiation onPaymentRecorded={loadHistory} />
        </div>

        {/* Payment Tips */}
        <div className="space-y-4">
          <div className="kp-gradient-primary rounded-xl p-6">
            <h3 className="font-semibold text-white mb-3">💡 Payment Tips</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2"><span>•</span><span>Always verify recipient details before sending</span></li>
              <li className="flex gap-2"><span>•</span><span>QR codes are the fastest and most secure method</span></li>
              <li className="flex gap-2"><span>•</span><span>USSD works without internet connection</span></li>
              <li className="flex gap-2"><span>•</span><span>Keep your PIN secure and never share it</span></li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Supported Providers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-xs font-bold">MTN</div>
                  <span className="text-sm font-medium">MTN Mobile Money</span>
                </div>
                    <span className="text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">Sandbox</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">AIRTEL</div>
                      <span className="text-sm font-medium">Airtel Money</span>
                    </div>
                    <span className="text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payment History</h3>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No payments recorded yet. Try one above.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Reference</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date & Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 dark:bg-gray-900">
                      <td className="py-4 px-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/50">
                          <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-300" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{payment.reference ?? '—'}</p>
                        {payment.provider && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{payment.provider}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900 dark:text-white">RWF {Math.abs(payment.amount).toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{METHOD_LABEL[payment.method] ?? payment.method}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(payment.created_at).toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {history.map((payment) => (
                <div key={payment.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/50">
                        <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-300" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{payment.reference ?? '—'}</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600 dark:text-gray-400">{METHOD_LABEL[payment.method] ?? payment.method}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">RWF {Math.abs(payment.amount).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(payment.created_at).toLocaleString()}</span>
                    {payment.provider && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{payment.provider}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
