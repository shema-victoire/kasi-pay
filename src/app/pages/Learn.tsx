import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Award, Play, CheckCircle, TrendingUp, Shield, Target, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const MODULE_TEXT_COLORS: Record<string, string> = {
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  green: 'text-green-600',
  red: 'text-red-600',
  orange: 'text-orange-600',
  indigo: 'text-indigo-600',
};
const MODULE_BG_COLORS: Record<string, string> = {
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  green: 'bg-green-100',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  indigo: 'bg-indigo-100',
};

const MODULE_DEFS = [
  { id: 'budgeting-basics', title: 'Budgeting Basics', description: 'Learn how to create and stick to a monthly budget', icon: Target, duration: '15 min', level: 'Beginner', lessons: 4, color: 'blue' },
  { id: 'understanding-credit', title: 'Understanding Credit', description: 'How credit scores work and how to build credit', icon: TrendingUp, duration: '20 min', level: 'Beginner', lessons: 5, color: 'purple' },
  { id: 'smart-saving', title: 'Smart Saving Strategies', description: 'Effective techniques to grow your savings', icon: Award, duration: '18 min', level: 'Intermediate', lessons: 6, color: 'green' },
  { id: 'fraud-prevention', title: 'Fraud Prevention', description: 'Protect yourself from financial scams and fraud', icon: Shield, duration: '12 min', level: 'Beginner', lessons: 3, color: 'red' },
  { id: 'msme-finance', title: 'Business Finance for MSMEs', description: 'Managing finances for small businesses', icon: Brain, duration: '25 min', level: 'Advanced', lessons: 7, color: 'orange' },
  { id: 'investment-basics', title: 'Investment Basics', description: 'Introduction to growing wealth through investments', icon: TrendingUp, duration: '22 min', level: 'Advanced', lessons: 6, color: 'indigo' },
];

const QUIZ_QUESTIONS = [
  { question: 'What percentage of your income should ideally go to savings?', options: ['5-10%', '15-20%', '30-40%', '50%'], correct: 1 },
  { question: 'Which factor has the biggest impact on your credit score?', options: ['Payment history', 'Credit utilization', 'Length of credit history', 'Types of credit'], correct: 0 },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
  { code: 'sw', label: 'Swahili' },
];

interface ProgressRow {
  module_id: string;
  completed: boolean;
  quiz_score: number | null;
}

export function Learn() {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('learn_progress').select('module_id, completed, quiz_score').eq('user_id', user.id);
    const map: Record<string, ProgressRow> = {};
    (data ?? []).forEach((row: any) => { map[row.module_id] = row; });
    setProgress(map);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProgress();
    if (profile?.language) setLanguage(profile.language);
  }, [loadProgress, profile]);

  const modules = MODULE_DEFS.map((m) => ({
    ...m,
    completed: progress[m.id]?.completed ?? false,
  }));

  const totalCompleted = modules.filter((m) => m.completed).length;
  const completionRate = (totalCompleted / modules.length) * 100;
  const quizScore = progress['daily-quiz']?.quiz_score ?? null;

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first module', earned: totalCompleted >= 1, icon: '🎯' },
    { id: 2, name: 'Budget Master', description: 'Complete Budgeting Basics', earned: progress['budgeting-basics']?.completed ?? false, icon: '💰' },
    { id: 3, name: 'Credit Champion', description: 'Complete Understanding Credit', earned: progress['understanding-credit']?.completed ?? false, icon: '⭐' },
    { id: 4, name: 'Quiz Taker', description: 'Complete the daily quiz', earned: quizScore !== null, icon: '🧠' },
    { id: 5, name: 'All Rounder', description: 'Complete all modules', earned: totalCompleted === modules.length, icon: '🏆' },
  ];

  const markComplete = async (moduleId: string) => {
    if (!user) return;
    await supabase.from('learn_progress').upsert(
      { user_id: user.id, module_id: moduleId, language, completed: true, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,module_id' }
    );
    await loadProgress();
    setSelectedModule(null);
  };

  const handleLanguageChange = async (code: string) => {
    setLanguage(code);
    if (user) {
      await supabase.from('profiles').update({ language: code }).eq('id', user.id);
      await refreshProfile();
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === QUIZ_QUESTIONS[quizStep].correct;
    const nextCorrect = quizCorrect + (isCorrect ? 1 : 0);
    setQuizCorrect(nextCorrect);

    if (quizStep + 1 < QUIZ_QUESTIONS.length) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizDone(true);
      const finalScore = Math.round((nextCorrect / QUIZ_QUESTIONS.length) * 100);
      if (user) {
        supabase
          .from('learn_progress')
          .upsert(
            { user_id: user.id, module_id: 'daily-quiz', language, completed: true, quiz_score: finalScore, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,module_id' }
          )
          .then(() => loadProgress());
      }
    }
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizStep(0);
    setQuizCorrect(0);
    setQuizDone(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading your progress…</div>;
  }

  const selected = modules.find((m) => m.id === selectedModule);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Literacy</h1>
        <p className="text-gray-600 dark:text-gray-400">Build your financial knowledge and make informed decisions</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6" />
              <p className="text-blue-100">Your Learning Journey</p>
            </div>
            <h2 className="text-4xl font-bold mb-2">{completionRate.toFixed(0)}% Complete</h2>
            <p className="text-blue-100">{totalCompleted} of {modules.length} modules completed</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100 mb-1">Quiz Score</p>
              <p className="text-2xl font-bold">{quizScore !== null ? `${quizScore}%` : '—'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100 mb-1">Achievements</p>
              <p className="text-2xl font-bold">{achievements.filter((a) => a.earned).length}/{achievements.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Modules</h3>

          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedModule(module.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${MODULE_BG_COLORS[module.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {module.completed ? (
                      <CheckCircle className={`w-7 h-7 ${MODULE_TEXT_COLORS[module.color]}`} />
                    ) : (
                      <IconComponent className={`w-7 h-7 ${MODULE_TEXT_COLORS[module.color]}`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{module.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                      </div>
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {module.lessons} lessons
                      </span>
                      <span>⏱️ {module.duration}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        module.level === 'Beginner' ? 'bg-green-100 text-green-700' : module.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {module.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${module.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 dark:text-gray-400'}`}>
                        {module.completed ? 'Completed' : 'Not started'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <p className={`font-medium text-sm ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{achievement.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Daily Quiz
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {quizScore !== null ? `Last score: ${quizScore}%. Try again to improve` : 'Test your knowledge and earn points!'}
            </p>
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Start Quiz
            </button>
          </div>

          {/* Study Tips */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💡 Study Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2"><span>•</span><span>Complete one module per week</span></li>
              <li className="flex gap-2"><span>•</span><span>Apply what you learn immediately</span></li>
              <li className="flex gap-2"><span>•</span><span>Review modules to reinforce knowledge</span></li>
              <li className="flex gap-2"><span>•</span><span>Share learnings with family and friends</span></li>
            </ul>
          </div>

          {/* Language Selector */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🌍 Language</h3>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Saved to your profile and synced with your account settings</p>
          </div>
        </div>
      </div>

      {/* Module Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedModule(null)}>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selected.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selected.description}</p>
              </div>
              <button onClick={() => setSelectedModule(null)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What you'll learn:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Core concepts and principles</li>
                  <li>✓ Practical tips and strategies</li>
                  <li>✓ Real-world examples from Rwanda</li>
                  <li>✓ Interactive exercises and quizzes</li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selected.lessons}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lessons</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selected.duration}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selected.level}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Level</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => markComplete(selected.id)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {selected.completed ? 'Mark as Reviewed' : 'Complete Module'}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeQuiz}>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {!quizDone ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                </h3>
                <p className="text-gray-700 mb-6">{QUIZ_QUESTIONS[quizStep].question}</p>
                <div className="space-y-2">
                  {QUIZ_QUESTIONS[quizStep].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {Math.round((quizCorrect / QUIZ_QUESTIONS.length) * 100)}%
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You got {quizCorrect} of {QUIZ_QUESTIONS.length} correct. Saved to your profile
                </p>
                <button
                  onClick={closeQuiz}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
