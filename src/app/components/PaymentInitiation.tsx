import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, Phone, Copy, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

type PaymentMethod = 'qr' | 'mobile' | 'ussd';
type Provider = 'mtn' | 'airtel';

export function PaymentInitiation({ onPaymentRecorded }: { onPaymentRecorded?: () => void }) {
  const { user } = useAuth();
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('qr');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const reference = `KP${Date.now()}`;

  const qrData = JSON.stringify({
    merchant: 'KASI PAY',
    amount: amount || '0',
    reference,
    timestamp: new Date().toISOString(),
  });

  const ussdCode = '*182*8*1#';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    if (!user || !amount) return;
    setSubmitting(true);
    setResultMessage(null);

    const { error } = await supabase.from('payment_requests').insert({
      user_id: user.id,
      method: activeMethod,
      provider: activeMethod === 'ussd' ? null : provider ?? null,
      amount: Number(amount),
      status: 'simulated',
      reference,
    });

    setSubmitting(false);
    if (error) {
      setResultMessage(`Error: ${error.message}`);
    } else {
      setResultMessage(
        `Simulated payment of RWF ${Number(amount).toLocaleString()} recorded via ${activeMethod.toUpperCase()}. No real money moved.`
      );
      setAmount('');
      setPhoneNumber('');
      setProvider(null);
      onPaymentRecorded?.();
    }
  };

  const canSubmit =
    !!amount &&
    !submitting &&
    (activeMethod !== 'mobile' || (!!phoneNumber && !!provider));

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl dark:shadow-lime-500/5 p-6 md:p-8 border border-transparent dark:border-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-lime-400">Payment Initiation</h3>
          <span className="text-xs px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full border border-yellow-200 dark:border-yellow-800">
            Sandbox: no real money moves
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Choose your preferred payment method</p>
      </div>

      {/* Payment Method Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
        <button
          onClick={() => setActiveMethod('qr')}
          style={activeMethod === 'qr' ? { background: 'var(--kp-gradient-soft)', color: 'white' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition ${
            activeMethod === 'qr' ? 'shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span className="text-sm font-medium">QR Code</span>
        </button>
        <button
          onClick={() => setActiveMethod('mobile')}
          style={activeMethod === 'mobile' ? { background: 'var(--kp-gradient-soft)', color: 'white' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition ${
            activeMethod === 'mobile' ? 'shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">Mobile Money</span>
        </button>
        <button
          onClick={() => setActiveMethod('ussd')}
          style={activeMethod === 'ussd' ? { background: 'var(--kp-gradient-soft)', color: 'white' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition ${
            activeMethod === 'ussd' ? 'shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">USSD</span>
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (RWF)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg kp-focus-ring focus:border-transparent outline-none transition"
        />
      </div>

      <div className="min-h-[300px]">
        {/* QR Code Method */}
        {activeMethod === 'qr' && (
          <div className="text-center">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mb-4 inline-block border border-gray-200 dark:border-gray-800">
              {amount ? (
                <QRCodeSVG value={qrData} size={200} level="H" />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <div className="text-center text-gray-400 dark:text-gray-600">
                    <QrCode className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Enter amount to generate QR</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Scan this QR code with your mobile money app to complete payment
            </p>
            <div className="flex gap-2 justify-center text-xs text-gray-500 mb-4">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">MTN Mobile Money</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">Airtel Money</span>
            </div>
          </div>
        )}

        {/* Mobile Money Method */}
        {activeMethod === 'mobile' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Money Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="078XXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg kp-focus-ring focus:border-transparent outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Provider</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('mtn')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                    provider === 'mtn'
                      ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/10'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-lime-500'
                  }`}
                >
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-xs font-bold">MTN</div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">MTN MoMo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProvider('airtel')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                    provider === 'airtel'
                      ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/10'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-lime-500'
                  }`}
                >
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">AIRTEL</div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Airtel Money</span>
                </button>
              </div>
            </div>

            <div className="kp-success rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-2" style={{ color: 'var(--kp-green-dark)' }}>Payment Process:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: 'var(--kp-green-mid)' }}>
                <li>Enter your mobile money number</li>
                <li>Select your provider</li>
                <li>This is recorded as a simulated payment (sandbox mode)</li>
              </ol>
            </div>
          </div>
        )}

        {/* USSD Method */}
        {activeMethod === 'ussd' && (
          <div>
            <div className="kp-gradient-subtle rounded-xl p-6 mb-4 border border-white/20 shadow-lg">
              <div className="text-center mb-4">
                <Phone className="w-12 h-12 mx-auto text-white mb-3" />
                <h4 className="font-semibold mb-2 kp-text-on-gradient">Dial USSD Code</h4>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold" style={{ color: 'var(--kp-green-dark)' }}>{ussdCode}</span>
                  <button onClick={() => handleCopy(ussdCode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    {copied ? <Check className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/90 text-center">Dial this code from your mobile phone to access KASI PAY services</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note:</strong> USSD works on all phones, including feature phones. Use the button below to record this as a simulated payment.
              </p>
            </div>
          </div>
        )}
      </div>

      {resultMessage && (
        <p className={`text-sm mt-4 rounded-lg px-3 py-2 border ${
          resultMessage.startsWith('Error')
            ? 'text-red-600 bg-red-50 border-red-200'
            : 'text-green-700 bg-green-50 border-green-200'
        }`}>
          {resultMessage}
        </p>
      )}

      <button
        onClick={handlePayment}
        disabled={!canSubmit}
        className="w-full mt-4 py-3 kp-gradient-soft text-white rounded-lg font-medium hover:shadow-lg kp-hover-lift transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? 'Recording…' : 'Confirm Payment (Simulated)'}
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Simulated sandbox payment by KASI PAY</span>
        </div>
      </div>
    </div>
  );
}
