export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'scorer' | 'viewer';
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    match_updates: boolean;
    team_updates: boolean;
    score_updates: boolean;
  };
  language: string;
  timezone: string;
  default_team?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
  confirm_password: string;
  role?: 'scorer' | 'viewer';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileRequest {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserSession {
  id: string;
  user_id: string;
  token: string;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
  last_activity: Date;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string[];
}

export interface JWTPayload {
  user_id: string;
  email: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface UserStats {
  user_id: string;
  matches_created: number;
  matches_scored: number;
  teams_created: number;
  players_added: number;
  total_activity: number;
  last_activity: Date;
  favorite_teams: string[];
  recent_matches: string[];
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  resource_type: 'match' | 'team' | 'player' | 'user';
  resource_id: string;
  description: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface UserPermission {
  id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  permission: 'read' | 'write' | 'delete' | 'admin';
  granted_by: string;
  granted_at: Date;
  expires_at?: Date;
}

export interface AuthConfig {
  jwt_secret: string;
  jwt_expires_in: string;
  refresh_token_expires_in: string;
  password_min_length: number;
  password_require_special: boolean;
  password_require_numbers: boolean;
  password_require_uppercase: boolean;
  max_login_attempts: number;
  lockout_duration: number;
  email_verification_required: boolean;
  password_reset_expires: string;
  session_timeout: number;
}
