export interface PlayerStats {
    id: string;
    player_id: string;
    player_name: string;
    team_id: string;
    team_name: string;
    matches_played: number;
    innings_batted: number;
    runs_scored: number;
    balls_faced: number;
    highest_score: number;
    batting_average: number;
    strike_rate: number;
    centuries: number;
    half_centuries: number;
    fours: number;
    sixes: number;
    innings_bowled: number;
    overs_bowled: number;
    balls_bowled: number;
    wickets_taken: number;
    runs_conceded: number;
    bowling_average: number;
    economy_rate: number;
    bowling_strike_rate: number;
    best_bowling: string;
    five_wickets: number;
    catches: number;
    stumpings: number;
    run_outs: number;
    created_at: Date;
    updated_at: Date;
}
export interface MatchPlayerStats {
    id: string;
    match_id: string;
    player_id: string;
    player_name: string;
    team_id: string;
    team_name: string;
    batting_stats: BattingStats;
    bowling_stats: BowlingStats;
    fielding_stats: FieldingStats;
    created_at: Date;
    updated_at: Date;
}
export interface BattingStats {
    innings_number: number;
    runs_scored: number;
    balls_faced: number;
    fours: number;
    sixes: number;
    strike_rate: number;
    dismissal_type?: 'not_out' | 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'retired_hurt';
    dismissed_by?: string;
    dismissed_by_name?: string;
    partnership_runs?: number;
    partnership_balls?: number;
}
export interface BowlingStats {
    innings_number: number;
    overs_bowled: number;
    balls_bowled: number;
    runs_conceded: number;
    wickets_taken: number;
    economy_rate: number;
    bowling_strike_rate: number;
    maidens: number;
    wides: number;
    no_balls: number;
    best_over?: string;
}
export interface FieldingStats {
    catches: number;
    stumpings: number;
    run_outs: number;
    assists: number;
}
export interface PlayerPerformance {
    player_id: string;
    player_name: string;
    team_name: string;
    total_matches: number;
    batting_rank: number;
    bowling_rank: number;
    all_rounder_rank: number;
    recent_form: 'excellent' | 'good' | 'average' | 'poor';
    key_achievements: string[];
}
export interface TeamStats {
    team_id: string;
    team_name: string;
    matches_played: number;
    matches_won: number;
    matches_lost: number;
    matches_tied: number;
    win_percentage: number;
    total_runs_scored: number;
    total_runs_conceded: number;
    net_run_rate: number;
    highest_total: number;
    lowest_total: number;
    best_bowling_figures: string;
    top_batsman: string;
    top_bowler: string;
}
export interface CreatePlayerStatsRequest {
    player_id: string;
    match_id: string;
    batting_stats: BattingStats;
    bowling_stats: BowlingStats;
    fielding_stats: FieldingStats;
}
export interface UpdatePlayerStatsRequest {
    batting_stats?: Partial<BattingStats>;
    bowling_stats?: Partial<BowlingStats>;
    fielding_stats?: Partial<FieldingStats>;
}
export interface PlayerStatsSummary {
    player_id: string;
    player_name: string;
    team_name: string;
    matches_played: number;
    batting_average: number;
    bowling_average: number;
    all_rounder_score: number;
    recent_performance: string;
}
//# sourceMappingURL=PlayerStats.d.ts.map