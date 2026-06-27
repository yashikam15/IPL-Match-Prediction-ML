// src/components/LivePrediction.tsx
import React, { useState, useEffect } from 'react';
import { 
  Tv2, 
  RotateCcw, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Team, LivePredictionRequest, LivePredictionResponse } from '../types';
import { getTeamColor } from './PreMatchPrediction';

export default function LivePrediction() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [currentScore, setCurrentScore] = useState<number>(85);
  const [wicketsLost, setWicketsLost] = useState<number>(2);
  const [oversCompleted, setOversCompleted] = useState<number>(10.0);
  const [isChasing, setIsChasing] = useState<boolean>(true); // Target set vs 1st Innings
  const [targetScore, setTargetScore] = useState<number>(170);

  // Response Projections
  const [prediction, setPrediction] = useState<LivePredictionResponse | null>({
    current_run_rate: 8.5,
    required_run_rate: 8.5,
    batting_team_probability: 56.4,
    bowling_team_probability: 43.6,
    balls_remaining: 60,
    runs_needed: 85
  });

  // Fetch teams list
  useEffect(() => {
    async function loadTeams() {
      try {
        const res = await fetch('/api/teams');
        if (!res.ok) throw new Error("Faulty loading raw teams");
        const list = await res.json();
        setTeams(list);
        if (list.length >= 2) {
          setBattingTeam(list[0].team_name);
          setBowlingTeam(list[1].team_name);
        }
      } catch (err) {
        const fallbackTeams = [
          { team_id: 1, team_name: "Mumbai Indians", short_name: "MI", titles: 5, win_percentage: 56.7 },
          { team_id: 2, team_name: "Chennai Super Kings", short_name: "CSK", titles: 4, win_percentage: 58.4 }
        ];
        setTeams(fallbackTeams);
        setBattingTeam(fallbackTeams[0].team_name);
        setBowlingTeam(fallbackTeams[1].team_name);
      }
    }
    loadTeams();
  }, []);

  // Recalculate predictions in real-time or when button clicked
  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (battingTeam === bowlingTeam) {
      setError("Batting and Bowling teams cannot be the same!");
      return;
    }
    if (oversCompleted < 0 || oversCompleted > 20) {
      setError("Overs completed must be between 0.0 and 20.0!");
      return;
    }
    
    // Check fractional balls (e.g. 10.6 overs, 10.7 is invalid in cricket, max fractional part is .5)
    const overFractionStr = (oversCompleted % 1).toFixed(1);
    const fractionPart = parseFloat(overFractionStr);
    if (fractionPart > 0.5) {
      setError("Fractional over part cannot exceed .5 (Max 5 balls per over. E.g., 10.5, then 11.0).");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload: LivePredictionRequest = {
        batting_team: battingTeam,
        bowling_team: bowlingTeam,
        current_score: Number(currentScore),
        wickets_lost: Number(wicketsLost),
        overs_completed: Number(oversCompleted),
        target_score: isChasing ? Number(targetScore) : 0
      };

      const res = await fetch('/api/predict-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Calculation engine failed");
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      setError("Failed to resolve live probabilities. Check numeric boundaries.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial calculations
  useEffect(() => {
    if (battingTeam && bowlingTeam) {
      handleCalculate();
    }
  }, [battingTeam, bowlingTeam, currentScore, wicketsLost, oversCompleted, isChasing, targetScore]);

  const resetLiveState = () => {
    setCurrentScore(85);
    setWicketsLost(2);
    setOversCompleted(10);
    setIsChasing(true);
    setTargetScore(170);
    setError(null);
  };

  const batColor = getTeamColor(battingTeam);
  const bowlColor = getTeamColor(bowlingTeam);

  return (
    <div className="space-y-6" id="live-predict-view">
      {/* View Subheader Controls */}
      <div className="flex justify-end pt-1">
        <button
          onClick={resetLiveState}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 px-3 rounded-lg border border-slate-200 flex items-center space-x-1.5 font-bold transition-colors shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset Innings Slider</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-800 text-sm">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Grid */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 sm:p-6 lg:col-span-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Innings Live Parameters
            </h3>
            <p className="text-slate-400 text-xs mt-1">Recalculates prediction weights automatically on input edit.</p>
          </div>

          <div className="space-y-4">
            {/* Batting Team selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Batting Team (Innings Team)
              </label>
              <select
                id="live-batting-team"
                value={battingTeam}
                onChange={(e) => setBattingTeam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
              >
                {teams.map(t => (
                  <option key={t.team_id} value={t.team_name}>{t.team_name}</option>
                ))}
              </select>
            </div>

            {/* Bowling Team selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Bowling Team (Defending Team)
              </label>
              <select
                id="live-bowling-team"
                value={bowlingTeam}
                onChange={(e) => setBowlingTeam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
              >
                {teams.filter(t => t.team_name !== battingTeam).map(t => (
                  <option key={t.team_id} value={t.team_name}>{t.team_name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Current Score */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Score (Runs)
                </label>
                <input
                  type="number"
                  min="0"
                  max="400"
                  id="live-current-score"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-extrabold"
                />
              </div>

              {/* Wickets Lost */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Wickets Lost
                </label>
                <select
                  id="live-wickets-lost"
                  value={wicketsLost}
                  onChange={(e) => setWicketsLost(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-extrabold"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Overs Completed */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Overs Completed
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  id="live-overs-completed"
                  value={oversCompleted}
                  onChange={(e) => setOversCompleted(Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Innings Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Match Phase
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setIsChasing(false); setPrediction(null); }}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                      !isChasing 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    1st Inning
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsChasing(true); setPrediction(null); }}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                      isChasing 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Chasing
                  </button>
                </div>
              </div>
            </div>

            {/* Target Score Input if chasing */}
            {isChasing && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5 transition-all">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Target Runs to Defeat
                </label>
                <input
                  type="number"
                  min="1"
                  max="400"
                  id="live-target-score"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-extrabold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Output Panels */}
        <div className="lg:col-span-7 space-y-6">
          {prediction && (
            <div className="space-y-6">
              
              {/* Core run rates dashboard layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Current Run Rate (CRR)</span>
                  <div className="text-4xl font-black text-slate-800 mt-1 font-mono">{prediction.current_run_rate}</div>
                  <p className="text-slate-500 text-xs mt-1">Standard runs scored per completed over.</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Required Run Rate (RRR)</span>
                  <div className={`text-4xl font-black mt-1 font-mono ${prediction.required_run_rate > 10 ? 'text-blue-600' : 'text-slate-800'}`}>
                    {isChasing ? prediction.required_run_rate : 'N/A'}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    {isChasing ? "Midpoint target runs necessary per over." : "Not applicable in 1st innings."}
                  </p>
                </div>
              </div>

              {/* Dynamic probability panel - styled like Sleek Winner tracker */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-blue-50 text-blue-700 font-mono text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-blue-100 flex items-center space-x-1 font-bold">
                  <Zap className="h-2.5 w-2.5 text-blue-600 animate-pulse" />
                  <span>Real-Time Model Fitting</span>
                </div>

                <div className="text-center pb-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold block">Live Odds Probability</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 text-center">
                  {/* Batting Team odds */}
                  <div className="w-5/12">
                    <div className={`w-12 h-12 mx-auto ${batColor.bg} text-white rounded-full mb-2 flex items-center justify-center font-black text-sm`}>
                      {batColor.initials}
                    </div>
                    <span className="text-sm font-bold text-slate-800 truncate block mt-1 max-w-[180px]">{battingTeam}</span>
                    <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider mt-0.5">Batting</span>
                    <div className={`text-2xl font-black mt-1 ${batColor.text} font-mono`}>{prediction.batting_team_probability}%</div>
                  </div>

                  <div className="h-px w-20 sm:h-12 sm:w-px bg-slate-200" />

                  {/* Bowling Team odds */}
                  <div className="w-5/12">
                    <div className={`w-12 h-12 mx-auto ${bowlColor.bg} text-white rounded-full mb-2 flex items-center justify-center font-black text-sm`}>
                      {bowlColor.initials}
                    </div>
                    <span className="text-sm font-bold text-slate-800 truncate block mt-1 max-w-[180px]">{bowlingTeam}</span>
                    <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider mt-0.5">Defending</span>
                    <div className={`text-2xl font-black mt-1 ${bowlColor.text} font-mono`}>{prediction.bowling_team_probability}%</div>
                  </div>
                </div>

                {/* Mapped Team Progress bar */}
                <div className="space-y-2 mt-4">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div 
                      style={{ width: `${prediction.batting_team_probability}%` }} 
                      className={`${batColor.bg} h-full transition-all duration-300`}
                    />
                    <div 
                      style={{ width: `${prediction.bowling_team_probability}%` }} 
                      className={`${bowlColor.bg} h-full transition-all duration-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Match stats details */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center">
                  <Tv2 className="h-4 w-4 mr-1.5 text-blue-600" />
                  <span>Sub-Innings Live Indices</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-slate-50 p-3 py-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Balls Tracked:</span>
                    <strong className="font-mono text-slate-800 text-sm">{Math.round((20 - (prediction.balls_remaining / 6)) * 6)} / 120</strong>
                  </div>
                  <div className="bg-slate-50 p-3 py-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Delivery Balls Remaining:</span>
                    <strong className="font-mono text-slate-800 text-sm">{prediction.balls_remaining} balls</strong>
                  </div>
                  <div className="bg-slate-50 p-3 py-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Target Deficit:</span>
                    <strong className="font-mono text-slate-800 text-sm">
                      {isChasing ? `${prediction.runs_needed} runs required` : 'Establishing target'}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-3 py-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Resource Wickets Kept:</span>
                    <strong className="font-mono text-slate-800 text-sm">{10 - wicketsLost} wickets</strong>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
