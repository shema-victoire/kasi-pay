import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Award, Clock, CheckCircle, Smartphone, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Loan {
  id: string;
  amount: number;
  interest_rate: number;
  period_months: number;
  status: string;
  remaining_months: number | null;
  created_at: string;
}

const PURPOSES = ['Business Inventory', 'Emergency Expenses', 'Education', 'Home Improvement', 'Equipment Purchase', 'Other'];

export function Credit() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);

  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(3);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [showApplication, setShowApplication] = useState(false);
  const [applying, setApplying] = useState(false);

  const [factors, setFactors] = useState({
    paymentReliability: 0,
    mobileMoneyActivity: 0,
    transactionHistory: 0,
    pfmEngagement: 0,
    accountAge: 0,
  });
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [loanHistory, setLoanHistory] = useState<Loan[]>([]);

  const calculateAndLoad = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [txRes, payRes, budRes, goalRes, loanRes] = await Promise.all([
      supabase.from('transactions').select('id').eq('user_id', user.id),
      supabase.from('payment_requests').select('id').eq('user_id', user.id),
      supabase.from('budgets').select('id').eq('user_id', user.id),
      supabase.from('savings_goals').select('id').eq('user_id', user.id),
      supabase.from('loans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    const txCount = txRes.data?.length ?? 0;
    const payCount = payRes.data?.length ?? 0;
    const budCount = budRes.data?.length ?? 0;
    const goalCount = goalRes.data?.length ?? 0;

    const memberSince = profile?.member_since ? new Date(profile.member_since) : new Date();
    const daysActive = Math.max(0, Math.floor((Date.now() - memberSince.getTime()) / 86400000));

    // Real formula, capped 0-100 per factor
    const paymentReliability = Math.min(100, payCount * 15);
    const mobileMoneyActivity = Math.min(100, payCount * 12);
    const transactionHistory = Math.min(100, txCount * 8);
    const pfmEngagement = Math.min(100, budCount * 15 + goalCount * 15);
    const accountAge = Math.min(100, daysActive * 3);

    setFactors({ paymentReliability, mobileMoneyActivity, transactionHistory, pfmEngagement, accountAge });

    const weighted =
      paymentReliability * 0.3 +
      mobileMoneyActivity * 0.25 +
      transactionHistory * 0.2 +
      pfmEngagement * 0.15 +
      accountAge * 0.1;

    // Map 0-100 weighted average onto a 300-850 style score range
    const score = Math.round(300 + (weighted / 100) * 550);
    setCreditScore(score);
    setLoanHistory((loanRes.data as Loan[]) ?? []);
    setLoading(false);

    // save a snapshot
    if (user) {
      await supabase.from('credit_scores').insert({
        user_id: user.id,
        score,
        payment_reliability: Math.round(paymentReliability),
        mobile_money_activity: Math.round(mobileMoneyActivity),
        transaction_history: Math.round(transactionHistory),
        pfm_engagement: Math.round(pfmEngagement),
        account_age: Math.round(accountAge),
      });
    }
  }, [user, profile]);

  useEffect(() => {
    calculateAndLoad();
  }, [calculateAndLoad]);

  const score = creditScore ?? 300;
  const maxLoanAmount = Math.max(10000, Math.round((score - 300) / 550 * 490000) + 10000);
  const interestRate = score >= 700 ? 2.5 : score >= 500 ? 4 : 6;
  const monthlyPayment = (loanAmount * (1 + (interestRate / 100) * loanPeriod)) / loanPeriod;

  const scoreFactorDisplay = [
    { name: 'Payment Reliability', score: Math.round(factors.paymentReliability), weight: 30, icon: CheckCircle, color: 'green' },
    { name: 'Mobile Money Activity', score: Math.round(factors.mobileMoneyActivity), weight: 25, icon: Smartphone, color: 'blue' },
    { name: 'Transaction History', score: Math.round(factors.transactionHistory), weight: 20, icon: Clock, color: 'purple' },
    { name: 'PFM Engagement', score: Math.round(factors.pfmEngagement), weight: 15, icon: TrendingUp, color: 'orange' },
    { name: 'Account Age', score: Math.round(factors.accountAge), weight: 10, icon: Award, color: 'indigo' },
  ];

  const handleApply = async () => {
    if (!user) return;
    setApplying(true);
    const { error } = await supabase.from('loans').insert({
      user_id: user.id,
      amount: loanAmount,
      interest_rate: interestRate,
      period_months: loanPeriod,
      status: 'active',
      remaining_months: loanPeriod,
    });
    setApplying(false);
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Loan application recorded',
        body: `RWF ${loanAmount.toLocaleString()} over ${loanPeriod} months (sandbox)`,
      });
      setShowApplication(true);
      calculateAndLoad();
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Calculating your credit score…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Alternative Credit Services</h1>
        <p className="text-gray-600">
          Real score, calculated from your actual activity. Loans below are in sandbox mode, no real funds disbursed.
        </p>
      </div>

      {/* Credit Score Card */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6" />
              <p className="text-purple-100">Your KASI PAY Credit Score</p>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-6xl font-bold">{score}</h2>
            </div>
            <p className="text-purple-100 mt-2">
              {score >= 700 ? 'Excellent. You qualify for our best rates' : score >= 500 ? 'Good. Building your credit profile' : 'Getting started. Use the app more to build your score'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-purple-100 mb-1">Max Loan</p>
              <p className="text-2xl font-bold">RWF {(maxLoanAmount / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-purple-100 mb-1">Interest Rate</p>
              <p className="text-2xl font-bold">{interestRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Loan Application */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Apply for Instant Credit</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount: RWF {loanAmount.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max={maxLoanAmount}
                  step="10000"
                  value={Math.min(loanAmount, maxLoanAmount)}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>RWF 10K</span>
                  <span>RWF {(maxLoanAmount / 1000).toFixed(0)}K</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Period: {loanPeriod} months
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={loanPeriod}
                  onChange={(e) => setLoanPeriod(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 month</span>
                  <span>12 months</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Loan Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-semibold">RWF {loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold">{interestRate}% per month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-semibold">RWF {((loanAmount * interestRate * loanPeriod) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-300">
                    <span className="text-gray-900 font-medium">Monthly Payment:</span>
                    <span className="font-bold text-blue-600">RWF {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-medium">Total Repayment:</span>
                    <span className="font-bold">RWF {(monthlyPayment * loanPeriod).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {applying ? 'Processing…' : 'Apply for Instant Credit'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                💡 This records a real, simulated loan in sandbox mode. No funds are actually disbursed.
              </p>
            </div>
          </div>

          {/* Score Factors */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Factors</h3>
            <div className="space-y-5">
              {scoreFactorDisplay.map((factor) => {
                const IconComponent = factor.icon;
                return (
                  <div key={factor.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 text-${factor.color}-600`} />
                        <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{factor.weight}% weight</span>
                        <span className="text-sm font-semibold text-gray-900">{factor.score}/100</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-${factor.color}-500`} style={{ width: `${factor.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>💡 Improve your score:</strong> Log more expenses and payments in Manage/Payment,
                set budgets and savings goals, and keep using the app over time. Every real factor above
                is recalculated from your actual activity.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Choose Amount</p>
                  <p className="text-xs text-gray-600">Select loan amount and period</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Instant Decision</p>
                  <p className="text-xs text-gray-600">Based on your real activity score</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Sandbox Record</p>
                  <p className="text-xs text-gray-600">Saved to your account, no real funds move</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Loan History</h3>
            {loanHistory.length === 0 ? (
              <p className="text-sm text-gray-500">No loans yet.</p>
            ) : (
              <div className="space-y-3">
                {loanHistory.map((loan) => (
                  <div key={loan.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">RWF {Number(loan.amount).toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        loan.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{new Date(loan.created_at).toLocaleDateString()}</p>
                    {loan.status === 'active' && (
                      <p className="text-xs text-gray-600 mt-1">
                        {loan.remaining_months} of {loan.period_months} months remaining
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-3">Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>No traditional credit history required</span></li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Score calculated from your real activity</span></li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Transparent, formula-based scoring</span></li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Build your score with every use</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Recorded</h3>
              <p className="text-gray-600">Sandbox loan saved to your account. No real funds disbursed</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-semibold">RWF {loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Purpose:</span>
                <span className="font-semibold">{purpose}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Repayment Period:</span>
                <span className="font-semibold">{loanPeriod} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-blue-600">
                  RWF {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowApplication(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
