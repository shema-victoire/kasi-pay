import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, CreditCard, PieChart, BookOpen, Shield, TrendingUp, CheckCircle } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 kp-gradient-soft rounded-lg flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900 dark:text-white" style={{ color: 'var(--kp-green-mid)' }}>KASI PAY</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">INSTAPAY</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full border border-yellow-200 dark:border-yellow-800">
              Sandbox — no real money moves
            </span>
            <Link to="/auth" className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="kp-gradient-primary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 kp-text-on-gradient leading-tight">
            From financial access to real financial health
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
            Rwanda has reached 96% financial inclusion — but access hasn't translated into credit and resilience.
            KASI PAY / INSTAPAY combines payments, alternative credit, budgeting, and financial literacy in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:shadow-xl transition flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/auth"
              className="px-8 py-4 border border-white/40 text-white rounded-lg font-semibold hover:bg-white/10 transition"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold" style={{ color: 'var(--kp-green-mid)' }}>96%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial inclusion in Rwanda — 7.8 million adults</p>
          </div>
          <div>
            <p className="text-4xl font-bold" style={{ color: 'var(--kp-green-mid)' }}>86%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Adults using mobile money</p>
          </div>
          <div>
            <p className="text-4xl font-bold" style={{ color: 'var(--kp-green-mid)' }}>99.8%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Of Rwandan businesses are MSMEs — most still credit-invisible</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">One platform, four real tools</h2>
          <p className="text-gray-600 dark:text-gray-400">Everything below is fully functional — try it yourself after signing up.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 kp-gradient-subtle">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Initiation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              QR code, Mobile Money (MTN &amp; Airtel), and USSD — three ways to pay, all in sandbox mode for now.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 kp-gradient-subtle">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Alternative Credit Score</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A real, transparent score built from your actual activity — no traditional credit history required.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 kp-gradient-subtle">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Finance Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real budgets, expense tracking, and savings goals — see exactly where your money goes.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 kp-gradient-subtle">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Financial Literacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learning modules and quizzes in English, Kinyarwanda, Français, and Swahili.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-[#1a1a1a] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 kp-gradient-soft text-white font-bold text-lg">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create your account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sign up in seconds — no paperwork, no branch visit.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 kp-gradient-soft text-white font-bold text-lg">2</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Use the tools that matter to you</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track spending, save toward a goal, or check your credit score.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 kp-gradient-soft text-white font-bold text-lg">3</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Build your financial profile</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Every real action you take strengthens your score over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox notice */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
          <Shield className="w-5 h-5 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>This is a working prototype.</strong> Accounts, budgets, credit scores, and everything you do here is
            real and saved — but payments and loans are simulated in sandbox mode. No real money moves yet.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to see it for yourself?</h2>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 px-8 py-4 kp-gradient-soft text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          <CheckCircle className="w-5 h-5" />
          Create Your Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        KASI PAY / INSTAPAY — a digital finance concept for Rwanda
      </footer>
    </div>
  );
}
