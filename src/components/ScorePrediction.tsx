// src/components/ScorePrediction.tsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Team, Venue, PredictScoreRequest, PredictScoreResponse } from '../types';

export default function ScorePrediction() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [venue, setVenue] = useState('');
  const [tossWinner, setTossWinner] = useState('');

  // Projections Output
  const [prediction, setPrediction] = useState<PredictScoreResponse | null>(null);

  // Load datasets on mount
  useEffect(() => {
    async function loadResources() {
      try {
        const [teamsRes, venuesRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/venues')
        ]);
        if (!teamsRes.ok || !venuesRes.ok) throw new Error("Faulty loading datasets");
        
        const teamsRaw = await teamsRes.json();
        const venuesRaw = await venuesRes.json();

        setTeams(teamsRaw);
        setVenues(venuesRaw);

        if (teamsRaw.length >= 2) {
          setBattingTeam(teamsRaw[0].team_name);
          setBowlingTeam(teamsRaw[1].team_name);
          setTossWinner(teamsRaw[0].team_name);
        }
        if (venuesRaw.length > 0) {
          setVenue(venuesRaw[0].venue_name);
        }
      } catch (err) {
        setError("Unable to stream live stats. Active locally styled backups compiled.");
        const fallbackTeams = [
          { team_id: 1, team_name: "Mumbai Indians", short_name: "MI", titles: 5, win_percentage: 56.7 },
          { team_id: 2, team_name: "Chennai Super Kings", short_name: "CSK", titles: 4, win_percentage: 58.4 },
          { team_id: 4, team_name: "Kolkata Knight Riders", short_name: "KKR", titles: 2, win_percentage: 51.5 }
        ];
        const fallbackVenues = [
          { venue_id: 1, venue_name: "Wankhede Stadium", city: "Mumbai", avg_first_innings_score: 168.5, toss_defendy_win_percent: 45, toss_chasey_win_percent: 55 },
          { venue_id: 2, venue_name: "Eden Gardens", city: "Kolkata", avg_first_innings_score: 165.4, toss_defendy_win_percent: 44, toss_chasey_win_percent: 56 }
        ];
        setTeams(fallbackTeams);
        setVenues(fallbackVenues);
        setBattingTeam(fallbackTeams[0].team_name);
        setBowlingTeam(fallbackTeams[1].team_name);
        setTossWinner(fallbackTeams[0].team_name);
        setVenue(fallbackVenues[0].venue_name);
      }
    }
    loadResources();
  }, []);

  // Sync toss option automatically
  useEffect(() => {
    if (battingTeam && bowlingTeam) {
      if (tossWinner !== battingTeam && tossWinner !== bowlingTeam) {
        setTossWinner(battingTeam);
      }
    }
  }, [battingTeam, bowlingTeam]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (battingTeam === bowlingTeam) {
      setError("Batting team and Bowling team cannot be identical!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const payload: PredictScoreRequest = {
        batting_team: battingTeam,
        bowling_team: bowlingTeam,
        venue,
        toss_winner: tossWinner
      };

      const res = await fetch('/api/predict-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Faulty response from score prediction");
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      setError("Score prediction algorithm failed. Verify parameters are within scale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="score-predict-view">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-800 text-sm">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Input Form */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 sm:p-6 lg:col-span-5 space-y-5">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Regressor Parameters
            </h3>
            <p className="text-slate-400 text-xs mt-1">Estimates expected scorecard scale.</p>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Batting Team selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Batting Team (Starting)
              </label>
              <select
                id="score-batting-team"
                value={battingTeam}
                onChange={(e) => { setBattingTeam(e.target.value); setPrediction(null); }}
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
                Bowling Team (Opponent)
              </label>
              <select
                id="score-bowling-team"
                value={bowlingTeam}
                onChange={(e) => { setBowlingTeam(e.target.value); setPrediction(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
              >
                {teams.filter(t => t.team_name !== battingTeam).map(t => (
                  <option key={t.team_id} value={t.team_name}>{t.team_name}</option>
                ))}
              </select>
            </div>

            {/* Stadium Venue */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Stadium Arena Venue
              </label>
              <select
                id="score-venue"
                value={venue}
                onChange={(e) => { setVenue(e.target.value); setPrediction(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              >
                {venues.map(v => (
                  <option key={v.venue_id} value={v.venue_name}>{v.venue_name} ({v.city})</option>
                ))}
              </select>
            </div>

            {/* Toss Winner */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Toss Winner Selection
              </label>
              <select
                id="score-toss-winner"
                value={tossWinner}
                onChange={(e) => { setTossWinner(e.target.value); setPrediction(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
              >
                <option value={battingTeam}>{battingTeam}</option>
                <option value={bowlingTeam}>{bowlingTeam}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-predict-score"
              className="w-full bg-slate-900 hover:bg-black text-white disabled:bg-slate-400 font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all mt-6 shadow-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="h-4.5 w-4.5 animate-spin" />
                  <span>Processing Regression Woods...</span>
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span>Predict Expected Score</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!prediction ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 space-y-4 shadow-sm min-h-[380px] flex flex-col justify-center">
              <TrendingUp className="h-12 w-12 text-slate-300 mx-auto stroke-[1.5]" />
              <h3 className="font-bold text-slate-800 text-base">Awaiting Score Range Projection</h3>
              <p className="max-w-md mx-auto text-xs text-slate-500 leading-relaxed">
                Configure your lineup attributes and match location on the left parameters section, and evaluate first-innings runs ranges using the Random Forest Regressor models.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Prediction Range Display */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-wider bg-slate-100 text-slate-500 py-1 px-2.5 rounded border border-slate-200 font-bold">
                  Ensemble: {prediction.model_used}
                </div>

                <div className="py-6">
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-widest text-center block font-bold">Predicted First-Innings Score Range</span>
                  <div className="text-5xl sm:text-6xl font-black text-blue-700 tracking-tight mt-3 font-mono">
                    {prediction.expected_score_range}
                  </div>
                  <p className="text-slate-500 text-xs mt-3 font-medium">
                    Midpoint representation calculated at <strong className="text-slate-800 font-mono text-sm font-black">{prediction.predicted_midpoint} Runs</strong>.
                  </p>
                </div>
              </div>

              {/* Factors break down table */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5 text-blue-600" />
                  <span>Calculated Regressor Weights breakdown</span>
                </h4>
                
                <div className="space-y-3 font-medium text-xs sm:text-sm">
                  {/* Venue base */}
                  <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                    <span className="text-slate-500">Venue Base Stadium Par Score:</span>
                    <span className="font-mono font-bold text-slate-800">{prediction.factors.venue_base} Runs</span>
                  </div>

                  {/* Batting adjuster */}
                  <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                    <span className="text-slate-500">Batting Strength Adjustment ({battingTeam}):</span>
                    <span className={`font-mono font-bold ${prediction.factors.batting_factor >= 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                      {prediction.factors.batting_factor >= 0 ? '+' : ''}{prediction.factors.batting_factor} Runs
                    </span>
                  </div>

                  {/* Bowling adjuster */}
                  <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                    <span className="text-slate-500">Bowling Deterrence Factor ({bowlingTeam}):</span>
                    <span className={`font-mono font-bold ${prediction.factors.bowling_factor >= 0 ? 'text-blue-600' : 'text-blue-600'}`}>
                      {prediction.factors.bowling_factor >= 0 ? '+' : ''}{prediction.factors.bowling_factor} Runs
                    </span>
                  </div>

                  {/* Toss Bonus */}
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="text-slate-500">Toss Choice Bonus Adjustment:</span>
                    <span className={`font-mono font-bold ${prediction.factors.toss_bonus >= 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                      {prediction.factors.toss_bonus >= 0 ? '+' : ''}{prediction.factors.toss_bonus} Runs
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-500 leading-relaxed font-sans">
                  <strong>ML Regressor Insight:</strong> Random Forest Regressor fits 100 deep estimators across ground variables. The prediction reflects par scored during peak boundary clearance intervals.
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
