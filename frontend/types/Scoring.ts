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
  created_at: string;
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
  created_at: string;
  updated_at: string;
  balls: Ball[];
}

export interface Scorecard {
  match_id: string;
  innings: Innings[];
}

export interface AddBallRequest {
  over_number: number;
  ball_number: number;
  bowler_id: string;
  bowler_name: string;
  batsman_id: string;
  batsman_name: string;
  runs: number;
  is_wicket?: boolean;
  wicket_type?: 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'retired_hurt';
  wicket_taker_id?: string;
  wicket_taker_name?: string;
  extras?: {
    type: 'wide' | 'no_ball' | 'byes' | 'leg_byes';
    runs: number;
  };
}

export interface StartInningsRequest {
  team_id: string;
  team_name: string;
}

export interface ScoringState {
  currentInnings: Innings | null;
  matchId: string;
  isScoring: boolean;
  currentOver: number;
  currentBall: number;
  currentBowler: string;
  currentBatsman: string;
}
