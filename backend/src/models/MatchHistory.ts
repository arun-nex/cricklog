export interface MatchHistory {
  id: string;
  match_id: string;
  match_name: string;
  team1_id: string;
  team1_name: string;
  team2_id: string;
  team2_name: string;
  match_type: 'T20' | 'ODI' | 'Test' | 'Custom';
  venue?: string;
  date: Date;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  toss_winner?: string;
  toss_decision?: 'bat' | 'bowl';
  result: MatchResult;
  created_at: Date;
  updated_at: Date;
}

export interface MatchResult {
  winner?: string;
  winner_name?: string;
  result_type: 'won' | 'tied' | 'no_result' | 'cancelled';
  margin?: string; // "by 5 wickets", "by 20 runs", etc.
  innings_summary: InningsSummary[];
  match_summary: MatchSummary;
  key_moments: KeyMoment[];
  player_of_match?: string;
  player_of_match_name?: string;
}

export interface InningsSummary {
  team_id: string;
  team_name: string;
  innings_number: number;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  balls_bowled: number;
  status: 'completed' | 'declared' | 'all_out';
  top_batsman: {
    player_id: string;
    player_name: string;
    runs: number;
    balls: number;
  };
  top_bowler: {
    player_id: string;
    player_name: string;
    wickets: number;
    runs: number;
    overs: number;
  };
  extras: {
    wides: number;
    no_balls: number;
    byes: number;
    leg_byes: number;
  };
}

export interface MatchSummary {
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  run_rate: number;
  highest_partnership: number;
  best_bowling_figures: {
    player_id: string;
    player_name: string;
    wickets: number;
    runs: number;
  };
  most_runs: {
    player_id: string;
    player_name: string;
    runs: number;
  };
  most_wickets: {
    player_id: string;
    player_name: string;
    wickets: number;
  };
}

export interface KeyMoment {
  id: string;
  over: number;
  ball: number;
  description: string;
  type: 'wicket' | 'boundary' | 'milestone' | 'partnership' | 'other';
  player_id?: string;
  player_name?: string;
  timestamp: Date;
}

export interface MatchReport {
  match_id: string;
  match_name: string;
  date: Date;
  venue?: string;
  teams: {
    team1: TeamReport;
    team2: TeamReport;
  };
  result: MatchResult;
  highlights: string[];
  statistics: MatchStatistics;
  timeline: MatchTimeline[];
}

export interface TeamReport {
  team_id: string;
  team_name: string;
  innings: InningsReport[];
  total_score: number;
  total_wickets: number;
  total_overs: number;
  run_rate: number;
  top_performers: {
    batsman: PlayerPerformance;
    bowler: PlayerPerformance;
  };
}

export interface InningsReport {
  innings_number: number;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  status: string;
  batting_card: BattingCard[];
  bowling_card: BowlingCard[];
  extras: ExtrasBreakdown;
}

export interface BattingCard {
  player_id: string;
  player_name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  dismissal_type?: string;
  dismissed_by?: string;
  partnership_runs?: number;
  partnership_balls?: number;
}

export interface BowlingCard {
  player_id: string;
  player_name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  economy: number;
  maidens: number;
  wides: number;
  no_balls: number;
}

export interface ExtrasBreakdown {
  wides: number;
  no_balls: number;
  byes: number;
  leg_byes: number;
  total: number;
}

export interface PlayerPerformance {
  player_id: string;
  player_name: string;
  runs?: number;
  balls?: number;
  wickets?: number;
  overs?: number;
  economy?: number;
  strike_rate?: number;
}

export interface MatchStatistics {
  total_balls: number;
  total_boundaries: number;
  total_sixes: number;
  total_fours: number;
  total_wides: number;
  total_no_balls: number;
  average_runs_per_over: number;
  highest_partnership: number;
  longest_partnership: number;
  fastest_fifty: number;
  fastest_century: number;
  most_economical_spell: number;
  most_expensive_spell: number;
}

export interface MatchTimeline {
  timestamp: Date;
  over: number;
  ball: number;
  event: string;
  description: string;
  team: string;
  player?: string;
  runs?: number;
  wickets?: number;
}

export interface MatchFilter {
  team_id?: string;
  match_type?: string;
  status?: string;
  date_from?: Date;
  date_to?: Date;
  venue?: string;
  result_type?: string;
}

export interface MatchHistorySummary {
  total_matches: number;
  completed_matches: number;
  live_matches: number;
  scheduled_matches: number;
  total_runs: number;
  total_wickets: number;
  average_score: number;
  highest_score: number;
  most_runs_by_player: string;
  most_wickets_by_player: string;
  most_matches_played: string;
}
