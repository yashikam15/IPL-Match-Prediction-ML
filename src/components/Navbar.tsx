// src/components/Navbar.tsx
import React from 'react';
import { 
  Trophy, 
  Home as HomeIcon, 
  Dices, 
  Tv2, 
  TrendingUp, 
  BarChart3, 
  Binary 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'pre-match', label: 'Pre-Match', icon: Dices },
    { id: 'live', label: 'Live Predict', icon: Tv2 },
    { id: 'score', label: 'Score Predict', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ml', label: 'ML Visuals', icon: Binary },
  ];

  return (
    <>
      {/* Desktop Sidebar (md and up) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 shrink-0 justify-between" id="desktop-sidebar">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-100">
            <div 
              onClick={() => setActiveTab('home')} 
              className="flex items-center gap-2.5 font-bold text-xl text-blue-800 cursor-pointer select-none group"
              id="aside-logo"
            >
              <div className="bg-blue-600 text-white p-1.5 rounded-lg transition-transform group-hover:scale-105 shadow-sm">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="tracking-tight text-slate-900 group-hover:text-blue-800 transition-colors">
                IPL PREDICTOR
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Aside Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 mr-3 ${isActive ? 'text-blue-600 stroke-[2.25px]' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Model Accuracy Footer Callout */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-700 font-medium space-y-1">
            <span className="text-[10px] text-blue-500 uppercase tracking-wider font-semibold block">Best Model Accuracy</span>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-600 text-xs">XGBoost:</span>
              <span className="font-extrabold text-lg text-blue-800">84.5%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Navigation Header (hidden on desktop) */}
      <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" id="mobile-navigation">
        <div className="px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">
              IPL Predictor
            </span>
          </div>
          <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-100">
            ACC: 84.5%
          </div>
        </div>

        {/* Mobile Horizontal scrollable tabs */}
        <div className="border-t border-slate-100 py-2.5 bg-slate-50 overflow-x-auto scrollbar-none flex">
          <div className="flex space-x-1.5 px-4 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-mobile-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mr-1.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
