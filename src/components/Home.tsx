// src/components/Home.tsx
import React from 'react';
import { 
  Trophy, 
  Dices, 
  Tv2, 
  TrendingUp, 
  BarChart3, 
  Binary, 
  Database, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export default function Home({ setActiveTab }: HomeProps) {
  const cards = [
    {
      id: 'pre-match',
      title: 'Pre-Match Winner Predictor',
      description: 'Calculate winner probabilities before the match starts using historical team records, batsman/bowler strength, head-to-head ratios, and venue statistics.',
      icon: Dices,
      badge: 'Classifier',
      color: 'border-blue-200 hover:border-blue-500 bg-white',
      iconBg: 'bg-blue-50 text-blue-600',
      textColor: 'group-hover:text-blue-700'
    },
    {
      id: 'live',
      title: 'Live Score Probability Tracker',
      description: 'Get real-time updates for on-going matches. Tracks current and required run-rates, adjusting winning projections ball-by-ball based on wickets lost.',
      icon: Tv2,
      badge: 'Live Engine',
      color: 'border-indigo-200 hover:border-indigo-500 bg-white',
      iconBg: 'bg-indigo-50 text-indigo-600',
      textColor: 'group-hover:text-indigo-700'
    },
    {
      id: 'score',
      title: 'First-Innings Score Predictor',
      description: 'Estimate expected first-innings scores on any venue under variations in batting/bowling combinations, captain strength, and toss biases.',
      icon: TrendingUp,
      badge: 'Regressor',
      color: 'border-amber-200 hover:border-amber-500 bg-white',
      iconBg: 'bg-amber-50 text-amber-600',
      textColor: 'group-hover:text-amber-700'
    },
  ];

  const stats = [
    { label: 'IPL Seasons Analyzed', value: '13 Seasons' },
    { label: 'Core Classifier Models', value: 'Decision Tree, RF, XGB' },
    { label: 'Score Regressor Model', value: 'Random Forest Regressor' },
    { label: 'Best Model Accuracy', value: '84.5% (XGBoost)' },
  ];

  return (
    <div className="space-y-8" id="home-view">
      {/* Welcome Hero Callout */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-100">
            <Sparkles className="h-3 w-3" />
            <span>Academic Submission Capstone Project</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 tracking-tight leading-none mt-1">
            Predict IPL Winner and Innings Score Range
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Welcome to the ultimate predictive analyzer. Built with advanced Decision Tree ensembles, Random Forests, and XGBoost structures trained on 2008–2020 match data. Toggle live states, stadium biases, and athletes lineup on-the-fly.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 border border-blue-700 shadow-md shrink-0 w-full md:w-80">
          <div className="flex items-center space-x-2 text-blue-200">
            <Trophy className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wider font-mono font-bold">ML Evaluation Verdict</span>
          </div>
          <p className="text-white text-lg font-bold mt-2 font-sans">
            Decision Woods & Boosters
          </p>
          <div className="text-[11px] text-blue-200 mt-1">
            Validated accuracy matches up to <strong className="text-amber-300">84.5%</strong>.
          </div>
        </div>
      </div>

      {/* Analytics Counter banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold flex items-center space-x-2 text-slate-800">
              <Database className="h-4.5 w-4.5 text-blue-600" />
              <span>Database Sync Status</span>
            </h3>
            <p className="text-slate-500 text-xs">
              Dynamically parsing historical Kaggle rows. Venue averages, toss gains, and player titles loaded instantly.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono tracking-wider">{stat.label}</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Core Prediction Feature Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Predictive Algorithms Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                id={`card-${card.id}`}
                onClick={() => setActiveTab(card.id)}
                className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between group ${card.color}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-mono font-bold">
                      {card.badge}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className={`font-bold text-slate-800 text-base transition-colors ${card.textColor}`}>
                      {card.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
                <div className={`pt-5 mt-auto flex items-center text-xs font-bold text-slate-700 transition-colors ${card.textColor}`}>
                  <span>Launch Predictor</span>
                  <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmarks Section & Dashboards shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 p-6 rounded-2xl">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="h-4.5 w-4.5 text-blue-600" />
            <span>Interactive Analytics Dashboard</span>
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Examine head-to-head records, geographical toss ratios, stadium par runs, and historical boundaries per venue using high-fidelity Recharts visual components.
          </p>
          <button 
            onClick={() => setActiveTab('analytics')}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3.5 rounded-lg inline-flex items-center transition-colors shadow-sm"
          >
            Explore Analytics
            <ChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>

        <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Binary className="h-4.5 w-4.5 text-indigo-600" />
            <span>Model Validation Metrics</span>
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Evaluate precision, recall, F1 indexes, and confusion categorizations for classifications alongside actual-vs-predicted curves for first-innings run predictions.
          </p>
          <button 
            onClick={() => setActiveTab('ml')}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3.5 rounded-lg inline-flex items-center transition-colors shadow-sm"
          >
            Review ML Model Metrics
            <ChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
