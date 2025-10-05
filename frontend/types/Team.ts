export interface Team {
  id: string;
  name: string;
  description?: string;
  captain?: string;
  created_at: string;
  updated_at: string;
  players: Player[];
}

export interface Player {
  id: string;
  team_id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  batting_style?: 'right-handed' | 'left-handed';
  bowling_style?: 'right-arm fast' | 'right-arm medium' | 'right-arm spin' | 'left-arm fast' | 'left-arm medium' | 'left-arm spin' | 'leg-spin' | 'off-spin';
  jersey_number?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  captain?: string;
}

export interface CreatePlayerRequest {
  team_id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  batting_style?: 'right-handed' | 'left-handed';
  bowling_style?: 'right-arm fast' | 'right-arm medium' | 'right-arm spin' | 'left-arm fast' | 'left-arm medium' | 'left-arm spin' | 'leg-spin' | 'off-spin';
  jersey_number?: number;
}
