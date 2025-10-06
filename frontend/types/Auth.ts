export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'scorer' | 'viewer';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
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
  expires_at: string;
  created_at: string;
  last_activity: string;
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
  last_activity: string;
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
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember_me?: boolean) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<AuthResponse>;
  refreshToken: () => Promise<AuthResponse>;
  verifyToken: () => Promise<boolean>;
}
