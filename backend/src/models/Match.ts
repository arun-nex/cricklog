export interface Match {
  id: string;
  name: string;
  description?: string;
  team1_id: string;
  team2_id: string;
  team1_name: string;
  team2_name: string;
  match_type: 'T20' | 'ODI' | 'Test' | 'Custom';
  overs?: number; // For T20, ODI, Custom matches
  venue?: string;
  date: Date;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  toss_winner?: string;
  toss_decision?: 'bat' | 'bowl';
  created_at: Date;
  updated_at: Date;
  innings: Innings[];
}

export interface Innings {
  id: string;
  match_id: string;
  team_id: string;
  team_name: string;
  innings_number: number;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  balls_bowled: number;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: Date;
  updated_at: Date;
  balls: Ball[];
}

export interface Ball {
  id: string;
  innings_id: string;
  over_number: number;
  ball_number: number;
  bowler_id: string;
  bowler_name: string;
  batsman_id: string;
  batsman_name: string;
  runs: number;
  is_wicket: boolean;
  wicket_type?: 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'retired_hurt';
  wicket_taker_id?: string;
  wicket_taker_name?: string;
  extras?: {
    type: 'wide' | 'no_ball' | 'byes' | 'leg_byes';
    runs: number;
  };
  created_at: Date;
}

export interface CreateMatchRequest {
  name: string;
  description?: string;
  team1_id: string;
  team2_id: string;
  match_type: 'T20' | 'ODI' | 'Test' | 'Custom';
  overs?: number;
  venue?: string;
  date: string; // ISO date string
}

export interface MatchSummary {
  id: string;
  name: string;
  team1_name: string;
  team2_name: string;
  match_type: string;
  venue?: string;
  date: Date;
  status: string;
  team1_score?: string;
  team2_score?: string;
  current_innings?: string;
  overs_bowled?: number;
  target?: number;
}
