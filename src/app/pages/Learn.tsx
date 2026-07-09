import { useState } from 'react';
import { BookOpen, Award, Play, CheckCircle, Lock, TrendingUp, Shield, Target, Brain } from 'lucide-react';

export function Learn() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      title: 'Budgeting Basics',
      description: 'Learn how to create and stick to a monthly budget',
      icon: Target,
      duration: '15 min',
      level: 'Beginner',
      completed: true,
      progress: 100,
      lessons: 4,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Understanding Credit',
      description: 'How credit scores work and how to build credit',
      icon: TrendingUp,
      duration: '20 min',
      level: 'Beginner',
      completed: true,
      progress: 100,
      lessons: 5,
      color: 'purple'
    },
    {
      id: 3,
      title: 'Smart Saving Strategies',
      description: 'Effective techniques to grow your savings',
      icon: Award,
      duration: '18 min',
      level: 'Intermediate',
      completed: false,
      progress: 60,
      lessons: 6,
      color: 'green'
    },
    {
      id: 4,
      title: 'Fraud Prevention',
      description: 'Protect yourself from financial scams and fraud',
      icon: Shield,
      duration: '12 min',
      level: 'Beginner',
      completed: false,
      progress: 25,
      lessons: 3,
      color: 'red'
    },
    {
      id: 5,
      title: 'Business Finance for MSMEs',
      description: 'Managing finances for small businesses',
      icon: Brain,
      duration: '25 min',
      level: 'Advanced',
      completed: false,
      progress: 0,
      lessons: 7,
      color: 'orange'
    },
    {
      id: 6,
      title: 'Investment Basics',
      description: 'Introduction to growing wealth through investments',
      icon: TrendingUp,
      duration: '22 min',
      level: 'Advanced',
      completed: false,
      progress: 0,
      lessons: 6,
      color: 'indigo'
    },
  ];

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first module', earned: true, icon: '🎯' },
    { id: 2, name: 'Budget Master', description: 'Complete Budgeting Basics', earned: true, icon: '💰' },
    { id: 3, name: 'Credit Champion', description: 'Complete Understanding Credit', earned: true, icon: '⭐' },
    { id: 4, name: 'Learning Streak', description: '7 days in a row', earned: false, icon: '🔥' },
    { id: 5, name: 'All Rounder', description: 'Complete all modules', earned: false, icon: '🏆' },
  ];

  const quizQuestions = [
    {
      question: 'What percentage of your income should ideally go to savings?',
      options: ['5-10%', '15-20%', '30-40%', '50%'],
      correct: 1
    },
    {
      question: 'Which factor has the biggest impact on your credit score?',
      options: ['Payment history', 'Credit utilization', 'Length of credit history', 'Types of credit'],
      correct: 0
    }
  ];

  const totalCompleted = modules.filter(m => m.completed).length;
  const completionRate = (totalCompleted / modules.length) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Literacy</h1>
        <p className="text-gray-600">Build your financial knowledge and make informed decisions</p>
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
              <p className="text-sm text-blue-100 mb-1">Total Time</p>
              <p className="text-2xl font-bold">2.5 hrs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100 mb-1">Achievements</p>
              <p className="text-2xl font-bold">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Modules</h3>

          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedModule(module.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-${module.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {module.completed ? (
                      <CheckCircle className={`w-7 h-7 text-${module.color}-600`} />
                    ) : (
                      <IconComponent className={`w-7 h-7 text-${module.color}-600`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      {module.progress === 0 ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {module.lessons} lessons
                      </span>
                      <span>⏱️ {module.duration}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        module.level === 'Beginner'
                          ? 'bg-green-100 text-green-700'
                          : module.level === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {module.level}
                      </span>
                    </div>

                    {module.progress > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${module.color}-500`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <p className={`font-medium text-sm ${achievement.earned ? 'text-gray-900' : 'text-gray-600'}`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Daily Quiz
            </h3>
            <p className="text-sm text-gray-600 mb-4">Test your knowledge and earn points!</p>
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition">
              Start Quiz
            </button>
          </div>

          {/* Study Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Study Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>Complete one module per week</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Apply what you learn immediately</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Review modules to reinforce knowledge</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Share learnings with family and friends</span>
              </li>
            </ul>
          </div>

          {/* Language Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">🌍 Language</h3>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option>English</option>
              <option>Kinyarwanda</option>
              <option>Français</option>
              <option>Swahili</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">All modules are available in your preferred language</p>
          </div>
        </div>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedModule(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {modules.find(m => m.id === selectedModule)?.title}
                </h3>
                <p className="text-gray-600">{modules.find(m => m.id === selectedModule)?.description}</p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">What you'll learn:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Core concepts and principles</li>
                  <li>✓ Practical tips and strategies</li>
                  <li>✓ Real-world examples from Rwanda</li>
                  <li>✓ Interactive exercises and quizzes</li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{modules.find(m => m.id === selectedModule)?.lessons}</p>
                  <p className="text-xs text-gray-600">Lessons</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{modules.find(m => m.id === selectedModule)?.duration}</p>
                  <p className="text-xs text-gray-600">Duration</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{modules.find(m => m.id === selectedModule)?.level}</p>
                  <p className="text-xs text-gray-600">Level</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              {modules.find(m => m.id === selectedModule)?.progress === 0 ? 'Start Module' : 'Continue Learning'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}