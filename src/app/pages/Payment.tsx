import { PaymentInitiation } from '../components/PaymentInitiation';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function Payment() {
  const paymentHistory = [
    { id: 1, type: 'sent', recipient: 'Jean Uwase', amount: -15000, date: '2026-04-24 10:30', method: 'Mobile Money', status: 'completed' },
    { id: 2, type: 'received', recipient: 'Marie Mukamana', amount: 8000, date: '2026-04-23 15:45', method: 'QR Code', status: 'completed' },
    { id: 3, type: 'sent', recipient: 'Eric Niyonzima', amount: -25000, date: '2026-04-23 09:12', method: 'USSD', status: 'completed' },
    { id: 4, type: 'sent', recipient: 'Grace Umutoni', amount: -5000, date: '2026-04-22 18:20', method: 'Mobile Money', status: 'completed' },
    { id: 5, type: 'received', recipient: 'Customer Payment', amount: 50000, date: '2026-04-21 14:05', method: 'Account Transfer', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Initiation</h1>
        <p className="text-gray-600">Send and receive money securely across multiple channels</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Interface */}
        <div className="lg:col-span-2">
          <PaymentInitiation />
        </div>

        {/* Payment Tips */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Payment Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>Always verify recipient details before sending</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>QR codes are the fastest and most secure method</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>USSD works without internet connection</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Keep your PIN secure and never share it</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Supported Providers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-xs font-bold">
                    MTN
                  </div>
                  <span className="text-sm font-medium">MTN Mobile Money</span>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    AIRTEL
                  </div>
                  <span className="text-sm font-medium">Airtel Money</span>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    BANK
                  </div>
                  <span className="text-sm font-medium">Bank Transfer</span>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Payment History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Recipient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      payment.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {payment.type === 'received' ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{payment.recipient}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className={`font-semibold ${
                      payment.type === 'received' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {payment.amount > 0 ? '+' : ''}RWF {Math.abs(payment.amount).toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{payment.method}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{payment.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}