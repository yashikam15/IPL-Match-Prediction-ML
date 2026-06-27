// src/types.ts

export interface Team {
  team_id: number;
  team_name: string;
  short_name: string;
  titles: number;
  win_percentage: number;
}

export interface Venue {
  venue_id: number;
  venue_name: string;
  city: string;
  avg_first_innings_score: number;
  toss_defendy_win_percent: number;
  toss_chasey_win_percent: number;
}

export interface Player {
  player_id: number;
  player_name: string;
  team: string;
  role: string;
  batting_sr: number | null;
  bowling_eco: number | null;
  captain_win_percent: number | null;
}

export interface Match {
  id: number;
  season: number;
  city: string;
  date: string;
  team1: string;
  team2: string;
  toss_winner: string;
  toss_decision: string;
  result: string;
  dl_applied: number;
  winner: string;
  win_by_runs: number;
  win_by_wickets: number;
  player_of_match: string;
  venue: string;
}

export interface PredictWinnerRequest {
  team1: string;
  team2: string;
  venue: string;
  toss_winner: string;
  toss_decision: 'bat' | 'field';
  algorithm: 'Decision Tree' | 'Random Forest' | 'XGBoost';
}

export interface PredictWinnerResponse {
  predicted_winner: string;
  winning_probability: number;
  team1_prob: number;
  team2_prob: number;
  features_computed: {
    t1_base_winrate: number;
    t2_base_winrate: number;
    h2h_matches: number;
    h2h_t1_wins: number;
    h2h_t2_wins: number;
    venue_avg_first_innings: number;
    toss_winner: string;
    toss_decision: string;
  };
  model_used: string;
}

export interface PredictScoreRequest {
  batting_team: string;
  bowling_team: string;
  venue: string;
  toss_winner: string;
}

export interface PredictScoreResponse {
  expected_score_range: string;
  predicted_midpoint: number;
  factors: {
    venue_base: number;
    batting_factor: number;
    bowling_factor: number;
    toss_bonus: number;
  };
  model_used: string;
}

export interface LivePredictionRequest {
  batting_team: string;
  bowling_team: string;
  current_score: number;
  wickets_lost: number;
  overs_completed: number;
  target_score: number;
}

export interface LivePredictionResponse {
  current_run_rate: number;
  required_run_rate: number;
  batting_team_probability: number;
  bowling_team_probability: number;
  balls_remaining: number;
  runs_needed: number;
}

export interface AnalyticsStats {
  teamWins: { team: string; wins: number; matches: number; winRate: number }[];
  headToHead: { matchup: string; team1Wins: number; team2Wins: number }[];
  venueStats: { venue: string; avgScore: number; defendWins: number; chaseWins: number }[];
  tossImpact: { choice: string; winCount: number; percentage: number }[];
  seasonScores: { season: string; avgScore: number }[];
}

export interface MLMetrics {
  bestModel: string;
  bestAccuracy: number;
  classification: {
    algorithm: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][]; // [ [TN, FP], [FN, TP] ]
  }[];
  regression: {
    algorithm: string;
    mae: number;
    mse: number;
    r2Score: number;
    predictions: { actual: number; predicted: number; index: number }[];
  };
}
