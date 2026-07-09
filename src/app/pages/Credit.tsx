import { useState } from 'react';
import { TrendingUp, Award, Clock, CheckCircle, AlertCircle, Smartphone, CreditCard, Zap } from 'lucide-react';

export function Credit() {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(3);
  const [showApplication, setShowApplication] = useState(false);

  const creditScore = 742;
  const maxLoanAmount = 500000;
  const interestRate = 2.5;
  const monthlyPayment = (loanAmount * (1 + (interestRate / 100) * loanPeriod)) / loanPeriod;

  const scoreFactors = [
    { name: 'Payment Reliability', score: 85, weight: 30, icon: CheckCircle, color: 'green' },
    { name: 'Mobile Money Activity', score: 78, weight: 25, icon: Smartphone, color: 'blue' },
    { name: 'Transaction History', score: 72, weight: 20, icon: Clock, color: 'purple' },
    { name: 'PFM Engagement', score: 68, weight: 15, icon: TrendingUp, color: 'orange' },
    { name: 'Account Age', score: 90, weight: 10, icon: Award, color: 'indigo' },
  ];

  const loanHistory = [
    { id: 1, amount: 100000, status: 'paid', date: '2026-01-15', duration: 6 },
    { id: 2, amount: 75000, status: 'paid', date: '2025-09-20', duration: 4 },
    { id: 3, amount: 150000, status: 'active', date: '2026-03-10', duration: 12, remaining: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Alternative Credit Services</h1>
        <p className="text-gray-600">Access instant credit based on your digital financial footprint</p>
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
              <h2 className="text-6xl font-bold">{creditScore}</h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <p className="text-sm">+15 this month</p>
              </div>
            </div>
            <p className="text-purple-100 mt-2">Excellent - You qualify for our best rates</p>
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
              {/* Loan Amount Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount: RWF {loanAmount.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max={maxLoanAmount}
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>RWF 10K</span>
                  <span>RWF {(maxLoanAmount / 1000).toFixed(0)}K</span>
                </div>
              </div>

              {/* Loan Period */}
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

              {/* Loan Summary */}
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

              {/* Purpose Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option>Business Inventory</option>
                  <option>Emergency Expenses</option>
                  <option>Education</option>
                  <option>Home Improvement</option>
                  <option>Equipment Purchase</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                onClick={() => setShowApplication(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Apply for Instant Credit
              </button>

              <p className="text-xs text-gray-500 text-center">
                💡 Your application will be processed instantly based on your alternative credit score
              </p>
            </div>
          </div>

          {/* Credit Score Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Score Breakdown</h3>
            <div className="space-y-4">
              {scoreFactors.map((factor) => {
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
                      <div
                        className={`h-full bg-${factor.color}-500`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>💡 Improve your score:</strong> Keep making timely payments, use PFM tools regularly,
                and maintain consistent mobile money activity.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* How It Works */}
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
                  <p className="text-xs text-gray-600">AI analyzes your credit score</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Get Funds</p>
                  <p className="text-xs text-gray-600">Money sent to your wallet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loan History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Loan History</h3>
            <div className="space-y-3">
              {loanHistory.map((loan) => (
                <div key={loan.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">RWF {loan.amount.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      loan.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{loan.date}</p>
                  {loan.status === 'active' && (
                    <p className="text-xs text-gray-600 mt-1">
                      {loan.remaining} of {loan.duration} months remaining
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-3">Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>No traditional credit history required</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Instant approval decisions</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Transparent AI-based scoring</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Build credit with every payment</span>
              </li>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Approved!</h3>
              <p className="text-gray-600">Your loan has been approved instantly</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-semibold">RWF {loanAmount.toLocaleString()}</span>
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
              Confirm & Disburse
            </button>
            <button
              onClick={() => setShowApplication(false)}
              className="w-full py-3 mt-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}