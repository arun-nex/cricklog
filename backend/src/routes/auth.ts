import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  PasswordResetRequest, 
  PasswordResetConfirm,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserSession,
  UserStats,
  UserActivity,
  JWTPayload
} from '../models/Auth';

const router = express.Router();

// Mock data (in production, this would be database queries)
let users: User[] = [];
let sessions: UserSession[] = [];
let activities: UserActivity[] = [];
let userIdCounter = 1;
let sessionIdCounter = 1;

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = decoded;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, username, full_name, password, confirm_password, role = 'viewer' }: RegisterRequest = req.body;

    // Validation
    if (!email || !username || !full_name || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser: User = {
      id: `user_${userIdCounter++}`,
      email,
      username,
      full_name,
      role,
      is_active: true,
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
      preferences: {
        theme: 'auto',
        notifications: {
          email: true,
          push: true,
          match_updates: true,
          team_updates: true,
          score_updates: true
        },
        language: 'en',
        timezone: 'UTC'
      }
    };

    users.push(newUser);

    // Generate tokens
    const accessToken = jwt.sign(
      { 
        user_id: newUser.id, 
        email: newUser.email, 
        username: newUser.username, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { user_id: newUser.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Create session
    const session: UserSession = {
      id: `session_${sessionIdCounter++}`,
      user_id: newUser.id,
      token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      created_at: new Date(),
      last_activity: new Date(),
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      is_active: true
    };

    sessions.push(session);

    // Log activity
    const activity: UserActivity = {
      id: uuidv4(),
      user_id: newUser.id,
      action: 'register',
      resource_type: 'user',
      resource_id: newUser.id,
      description: 'User registered successfully',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      created_at: new Date()
    };
    activities.push(activity);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
        is_active: newUser.is_active,
        email_verified: newUser.email_verified,
        created_at: newUser.created_at
      },
      token: accessToken,
      refresh_token: refreshToken,
      expires_in: 24 * 60 * 60 // 24 hours in seconds
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember_me = false }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // For demo purposes, we'll use a simple password check
    // In production, you'd verify against the hashed password
    if (password !== 'password123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.last_login = new Date();
    user.updated_at = new Date();

    // Generate tokens
    const accessToken = jwt.sign(
      { 
        user_id: user.id, 
        email: user.email, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { user_id: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Create session
    const session: UserSession = {
      id: `session_${sessionIdCounter++}`,
      user_id: user.id,
      token: accessToken,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + (remember_me ? 30 : 1) * 24 * 60 * 60 * 1000),
      created_at: new Date(),
      last_activity: new Date(),
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      is_active: true
    };

    sessions.push(session);

    // Log activity
    const activity: UserActivity = {
      id: uuidv4(),
      user_id: user.id,
      action: 'login',
      resource_type: 'user',
      resource_id: user.id,
      description: 'User logged in successfully',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      created_at: new Date()
    };
    activities.push(activity);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
        email_verified: user.email_verified,
        last_login: user.last_login
      },
      token: accessToken,
      refresh_token: refreshToken,
      expires_in: remember_me ? 30 * 24 * 60 * 60 : 24 * 60 * 60
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req: any, res) => {
  try {
    const user = users.find(u => u.id === req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        is_active: user.is_active,
        email_verified: user.email_verified,
        created_at: user.created_at,
        last_login: user.last_login,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const { username, full_name, avatar_url, preferences }: UpdateProfileRequest = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.user_id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username is already taken
    if (username && username !== users[userIndex].username) {
      const existingUser = users.find(u => u.username === username && u.id !== req.user.user_id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      username: username || users[userIndex].username,
      full_name: full_name || users[userIndex].full_name,
      avatar_url: avatar_url || users[userIndex].avatar_url,
      preferences: preferences ? { ...users[userIndex].preferences, ...preferences } : users[userIndex].preferences,
      updated_at: new Date()
    };

    // Log activity
    const activity: UserActivity = {
      id: uuidv4(),
      user_id: req.user.user_id,
      action: 'update_profile',
      resource_type: 'user',
      resource_id: req.user.user_id,
      description: 'User profile updated',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      created_at: new Date()
    };
    activities.push(activity);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        username: users[userIndex].username,
        full_name: users[userIndex].full_name,
        avatar_url: users[userIndex].avatar_url,
        role: users[userIndex].role,
        preferences: users[userIndex].preferences
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Logout user
router.post('/logout', authenticateToken, (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Deactivate session
    const sessionIndex = sessions.findIndex(s => s.token === token);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].is_active = false;
    }

    // Log activity
    const activity: UserActivity = {
      id: uuidv4(),
      user_id: req.user.user_id,
      action: 'logout',
      resource_type: 'user',
      resource_id: req.user.user_id,
      description: 'User logged out',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      created_at: new Date()
    };
    activities.push(activity);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user activity
router.get('/activity', authenticateToken, (req: any, res) => {
  try {
    const userActivities = activities
      .filter(a => a.user_id === req.user.user_id)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 50); // Last 50 activities

    res.json({
      success: true,
      data: userActivities
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Refresh token
router.post('/refresh', (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    jwt.verify(refresh_token, JWT_SECRET, (err: any, decoded: any) => {
      if (err || decoded.type !== 'refresh') {
        return res.status(403).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      const user = users.find(u => u.id === decoded.user_id);
      if (!user || !user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { 
          user_id: user.id, 
          email: user.email, 
          username: user.username, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        token: accessToken,
        expires_in: 24 * 60 * 60
      });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req: any, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user.user_id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role
    }
  });
});

export default router;
