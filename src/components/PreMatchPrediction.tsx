// src/components/PreMatchPrediction.tsx
import React, { useState, useEffect } from 'react';
import { 
  Dices, 
  Sparkles, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';
import { Team, Venue, PredictWinnerRequest, PredictWinnerResponse } from '../types';

// Dynamic helper function to designate beautiful team accent colors
export const getTeamColor = (teamName: string): { bg: string, text: string, border: string, lightBg: string, initials: string } => {
  const name = teamName?.toLowerCase() || '';
  if (name.includes('mumbai') || name.includes('mi')) {
    return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200', lightBg: 'bg-blue-50', initials: 'MI' };
  }
  if (name.includes('chennai') || name.includes('csk') || name.includes('super kings')) {
    return { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200', lightBg: 'bg-yellow-50', initials: 'CSK' };
  }
  if (name.includes('royal') || name.includes('rcb') || name.includes('bangalore')) {
    return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-200', lightBg: 'bg-red-50', initials: 'RCB' };
  }
  if (name.includes('kolkata') || name.includes('kkr') || name.includes('riders')) {
    return { bg: 'bg-violet-700', text: 'text-violet-700', border: 'border-violet-200', lightBg: 'bg-violet-50', initials: 'KKR' };
  }
  if (name.includes('sunrisers') || name.includes('srh') || name.includes('hyderabad')) {
    return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', lightBg: 'bg-orange-50', initials: 'SRH' };
  }
  if (name.includes('delhi') || name.includes('capitals') || name.includes('dc')) {
    return { bg: 'text-sky-600 bg-sky-600', text: 'text-sky-600', border: 'border-sky-200', lightBg: 'bg-sky-50', initials: 'DC' };
  }
  if (name.includes('rajasthan') || name.includes('royals') || name.includes('rr')) {
    return { bg: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-200', lightBg: 'bg-pink-50', initials: 'RR' };
  }
  if (name.includes('punjab') || name.includes('kings px')) {
    return { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-200', lightBg: 'bg-rose-50', initials: 'PB' };
  }
  return { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200', lightBg: 'bg-slate-50', initials: 'IPL' };
};

export default function PreMatchPrediction() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [venue, setVenue] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState<'bat' | 'field'>('field');
  const [algorithm, setAlgorithm] = useState<'Decision Tree' | 'Random Forest' | 'XGBoost'>('XGBoost');

  // Prediction Output
  const [prediction, setPrediction] = useState<PredictWinnerResponse | null>(null);

  // Fetch lists on mount
  useEffect(() => {
    async function loadFormOptions() {
      try {
        const [teamsRes, venuesRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/venues')
        ]);
        if (!teamsRes.ok || !venuesRes.ok) throw new Error("Faulty state loading options");
        
        const teamsData = await teamsRes.json();
        const venuesData = await venuesRes.json();
        
        setTeams(teamsData);
        setVenues(venuesData);

        // Auto default some values if available
        if (teamsData.length >= 2) {
          setTeam1(teamsData[0].team_name);
          setTeam2(teamsData[1].team_name);
          setTossWinner(teamsData[0].team_name);
        }
        if (venuesData.length > 0) {
          setVenue(venuesData[0].venue_name);
        }
      } catch (err) {
        setError("Could not load internal team or venue datasets. Utilizing backup state.");
        const fallbackTeams = [
          { team_id: 1, team_name: "Mumbai Indians", short_name: "MI", titles: 5, win_percentage: 56.7 },
          { team_id: 2, team_name: "Chennai Super Kings", short_name: "CSK", titles: 4, win_percentage: 58.4 },
          { team_id: 3, team_name: "Royal Challengers Bangalore", short_name: "RCB", titles: 0, win_percentage: 48.2 },
          { team_id: 4, team_name: "Kolkata Knight Riders", short_name: "KKR", titles: 2, win_percentage: 51.5 }
        ];
        const fallbackVenues = [
          { venue_id: 1, venue_name: "Wankhede Stadium", city: "Mumbai", avg_first_innings_score: 168.5, toss_defendy_win_percent: 45, toss_chasey_win_percent: 55 },
          { venue_id: 2, venue_name: "MA Chidambaram Stadium", city: "Chennai", avg_first_innings_score: 162.2, toss_defendy_win_percent: 60, toss_chasey_win_percent: 40 }
        ];
        setTeams(fallbackTeams);
        setVenues(fallbackVenues);
        setTeam1(fallbackTeams[0].team_name);
        setTeam2(fallbackTeams[1].team_name);
        setTossWinner(fallbackTeams[0].team_name);
        setVenue(fallbackVenues[0].venue_name);
      }
    }
    loadFormOptions();
  }, []);

  // Update toss winner options automatically when team selections swap
  useEffect(() => {
    if (team1 && team2) {
      if (tossWinner !== team1 && tossWinner !== team2) {
        setTossWinner(team1);
      }
    }
  }, [team1, team2]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (team1 === team2) {
      setError("Team 1 and Team 2 cannot be the same team!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const payload: PredictWinnerRequest = {
        team1,
        team2,
        venue,
        toss_winner: tossWinner,
        toss_decision: tossDecision,
        algorithm
      };

      const res = await fetch('/api/predict-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Prediction API processing failed");
      const result = await res.json();
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Try restarting the server or check parameters.");
    } finally {
      setLoading(false);
    }
  };

  const swapTeams = () => {
    const temp = team1;
    setTeam1(team2);
    setTeam2(temp);
    if (tossWinner === temp) {
      setTossWinner(team2);
    } else {
      setTossWinner(team1);
    }
    setPrediction(null);
  };

  // Profile metadata for primary selection teams
  const t1Color = getTeamColor(team1);
  const t2Color = getTeamColor(team2);

  return (
    <div className="space-y-6" id="pre-match-view">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-800 text-sm">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Form Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 sm:p-6 lg:col-span-5 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Match Parameters Selection
            </h3>
            <p className="text-slate-400 text-xs mt-1">Configure teams and ground parameters below.</p>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Teams Picker with Swap Button */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Home Team (Team 1)
                </label>
                <select
                  id="select-team1"
                  value={team1}
                  onChange={(e) => { setTeam1(e.target.value); setPrediction(null); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                >
                  {teams.map(t => (
                    <option key={t.team_id} value={t.team_name}>{t.team_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapTeams}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs py-1.5 px-3.5 rounded-full inline-flex items-center space-x-1.5 border border-slate-200 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Swap Home/Away</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Away Team (Team 2)
                </label>
                <select
                  id="select-team2"
                  value={team2}
                  onChange={(e) => { setTeam2(e.target.value); setPrediction(null); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                >
                  {teams.filter(t => t.team_name !== team1).map(t => (
                    <option key={t.team_id} value={t.team_name}>{t.team_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stadium Venue */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Stadium Arena Venue
              </label>
              <select
                id="select-venue"
                value={venue}
                onChange={(e) => { setVenue(e.target.value); setPrediction(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              >
                {venues.map(v => (
                  <option key={v.venue_id} value={v.venue_name}>{v.venue_name} ({v.city})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Toss Winner */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Toss Winner
                </label>
                <select
                  id="select-toss-winner"
                  value={tossWinner}
                  onChange={(e) => { setTossWinner(e.target.value); setPrediction(null); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                >
                  <option value={team1}>{team1}</option>
                  <option value={team2}>{team2}</option>
                </select>
              </div>

              {/* Toss Decision */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Toss Choice
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setTossDecision('field'); setPrediction(null); }}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                      tossDecision === 'field' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Field
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTossDecision('bat'); setPrediction(null); }}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                      tossDecision === 'bat' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Bat
                  </button>
                </div>
              </div>
            </div>

            {/* Classification model selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Model Classifier Method
              </label>
              <select
                id="select-algorithm"
                value={algorithm}
                onChange={(e) => { setAlgorithm(e.target.value as any); setPrediction(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-bold"
              >
                <option value="Decision Tree">Decision Tree Classifier</option>
                <option value="Random Forest">Random Forest Classifier</option>
                <option value="XGBoost">XGBoost Classifier (84.5% Accuracy)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-predict-winner"
              className="w-full bg-slate-900 hover:bg-black text-white disabled:bg-slate-400 font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all mt-6 shadow-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Processing ML Classifier...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Calculate Probability</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {!prediction ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 space-y-4 shadow-sm min-h-[460px] flex flex-col justify-center">
              <Dices className="h-12 w-12 text-slate-300 mx-auto stroke-[1.5]" />
              <h3 className="font-bold text-slate-800 text-base">Awaiting Match Calculation</h3>
              <p className="max-w-md mx-auto text-xs text-slate-500 leading-relaxed">
                Choose the home lineup, opponent lineup, toss choice, and stadium parameters, then click the **Calculate Probability** button to process historical classifiers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Winner Projections Card - Styled like the Sleek template! */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 relative">
                {/* Live Prediction Label */}
                <div className="absolute top-4 right-4">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200 tracking-wider">
                    PROJECTION DECISION
                  </span>
                </div>

                <div className="text-center mb-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Predicted Match Winner</span>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {prediction.predicted_winner}
                  </p>
                </div>

                {/* Team Vs Layout with high-contrast colored initials badges */}
                <div className="flex justify-between items-center py-4">
                  {/* Team 1 Panel */}
                  <div className="text-center w-5/12">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto ${t1Color.bg} text-white rounded-full mb-3 flex items-center justify-center font-black text-xl shadow-md border-4 border-white`}>
                      {t1Color.initials}
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate px-1">{team1}</h4>
                    <p className={`text-xl sm:text-2xl font-black mt-2 ${t1Color.text}`}>{prediction.team1_prob}%</p>
                  </div>

                  {/* VS splitter */}
                  <div className="text-center flex flex-col items-center">
                    <div className="text-slate-300 font-extrabold text-2xl italic tracking-wider">VS</div>
                    <div className="h-10 w-[1px] bg-slate-200 my-1"></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Win Chance</span>
                  </div>

                  {/* Team 2 Panel */}
                  <div className="text-center w-5/12">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto ${t2Color.bg} text-white rounded-full mb-3 flex items-center justify-center font-black text-xl shadow-md border-4 border-white`}>
                      {t2Color.initials}
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate px-1">{team2}</h4>
                    <p className={`text-xl sm:text-2xl font-black mt-2 ${t2Color.text}`}>{prediction.team2_prob}%</p>
                  </div>
                </div>

                {/* Progress bar mapped to actual team colors! */}
                <div className="mt-4">
                  <div className="w-full bg-slate-100 h-2.5 rounded-full flex overflow-hidden border border-slate-200">
                    <div 
                      className={`${t1Color.bg} h-full transition-all duration-500`} 
                      style={{ width: `${prediction.team1_prob}%` }}
                    />
                    <div 
                      className={`${t2Color.bg} h-full transition-all duration-500`} 
                      style={{ width: `${prediction.team2_prob}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-6 pt-4 text-center">
                  <span className="text-xs text-slate-400 font-mono">
                    Model Algorithm Used: <strong className="text-blue-600 font-serif">{prediction.model_used}</strong>
                  </span>
                </div>
              </div>

              {/* Statistical Variables processed */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1.5 text-blue-600" />
                  <span>Computed Prediction Weights</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Head-to-Head Record</span>
                    <div className="text-base font-bold text-slate-800 mt-1">
                      {prediction.features_computed.h2h_matches > 0 ? (
                        <>
                          {prediction.features_computed.h2h_t1_wins} Wins / {prediction.features_computed.h2h_matches} Matches
                        </>
                      ) : (
                        "No Encounter History"
                      )}
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Determined dynamically by parsing logs.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Toss Bias Influence</span>
                    <div className="text-base font-bold text-slate-800 mt-1 truncate">
                      {prediction.features_computed.toss_winner} ({prediction.features_computed.toss_decision === 'field' ? 'Field' : 'Bat'})
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Stadium statistic toss bias correction.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Overall Tournament Winrate</span>
                    <div className="text-base font-bold text-slate-800 mt-1 font-mono">
                      {prediction.features_computed.t1_base_winrate}% (Team 1)
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Aggregated record from historical catalog.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Venue Average Par</span>
                    <div className="text-base font-bold text-slate-800 mt-1 font-mono">
                      {prediction.features_computed.venue_avg_first_innings} Runs
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Standard ground first-innings score.
                    </p>
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
