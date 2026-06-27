// src/App.tsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PreMatchPrediction from './components/PreMatchPrediction';
import LivePrediction from './components/LivePrediction';
import ScorePrediction from './components/ScorePrediction';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MLDashboard from './components/MLDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'pre-match':
        return <PreMatchPrediction />;
      case 'live':
        return <LivePrediction />;
      case 'score':
        return <ScorePrediction />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ml':
        return <MLDashboard />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: "IPL Analytics & Prediction Launchpad",
          subtitle: "Leverage advanced machine learning classifiers to anticipate cricket results."
        };
      case 'pre-match':
        return {
          title: "Match Winner Classifier",
          subtitle: "Analyze team records, toss options, and grounds to predict outcomes."
        };
      case 'live':
        return {
          title: "Live Score Probability Tracker",
          subtitle: "Track run-rates and calculate live target probabilities in real-time."
        };
      case 'score':
        return {
          title: "First-Innings Score Predictor",
          subtitle: "Calculate expected first-innings scores with Random Forest Regressor."
        };
      case 'analytics':
        return {
          title: "Comparative Sports Analytics",
          subtitle: "Review historical team runs, stadium trends, and seasonal stats."
        };
      case 'ml':
        return {
          title: "Model Validation Dashboard",
          subtitle: "Deep-dive into performance scores, error grids, and confusion matrices."
        };
      default:
        return {
          title: "IPL Predictor",
          subtitle: "Data-backed cricket analytics and machine learning prediction system."
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans antialiased" id="root-layout">
      {/* Sleek Navigation (Desktop Sidebar / Mobile Top bar) */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Area Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Universal Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none flex items-center gap-2">
              {headerInfo.title}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-tight">
              {headerInfo.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Kaggle Data Catalog</span>
            <div className="bg-white px-3.5 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              IPL Historical Range (2008–2020)
            </div>
          </div>
        </header>

        {/* View Main Content Workspace */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <div className="transition-all duration-300">
            {renderActiveView()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-400 text-xs font-sans mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            <p>
              &copy; {new Date().getFullYear()} IPL Match Winner & Score Prediction System. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              College Academic Submission Capstone Project. Powered by Express, React, and Scikit-learn datasets.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
