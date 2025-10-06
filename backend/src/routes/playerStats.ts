import express from 'express';
import { PlayerStats, MatchPlayerStats, CreatePlayerStatsRequest, UpdatePlayerStatsRequest, PlayerStatsSummary, PlayerPerformance, TeamStats } from '../models/PlayerStats';

const router = express.Router();

// Mock data (in production, this would be database queries)
let playerStats: PlayerStats[] = [];
let matchPlayerStats: MatchPlayerStats[] = [];
let statsIdCounter = 1;
let matchStatsIdCounter = 1;

// Get all player statistics
router.get('/', (req, res) => {
  try {
    const { team_id, sort_by, limit } = req.query;
    
    let filteredStats = [...playerStats];
    
    // Filter by team if specified
    if (team_id) {
      filteredStats = filteredStats.filter(stat => stat.team_id === team_id);
    }
    
    // Sort by specified field
    if (sort_by) {
      switch (sort_by) {
        case 'runs':
          filteredStats.sort((a, b) => b.runs_scored - a.runs_scored);
          break;
        case 'average':
          filteredStats.sort((a, b) => b.batting_average - a.batting_average);
          break;
        case 'wickets':
          filteredStats.sort((a, b) => b.wickets_taken - a.wickets_taken);
          break;
        case 'strike_rate':
          filteredStats.sort((a, b) => b.strike_rate - a.strike_rate);
          break;
        default:
          filteredStats.sort((a, b) => b.matches_played - a.matches_played);
      }
    }
    
    // Apply limit if specified
    if (limit) {
      filteredStats = filteredStats.slice(0, parseInt(limit as string));
    }
    
    res.json({
      success: true,
      data: filteredStats,
      count: filteredStats.length
    });
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get player statistics by player ID
router.get('/player/:playerId', (req, res) => {
  try {
    const { playerId } = req.params;
    
    const playerStat = playerStats.find(stat => stat.player_id === playerId);
    
    if (!playerStat) {
      return res.status(404).json({
        success: false,
        message: 'Player statistics not found'
      });
    }
    
    res.json({
      success: true,
      data: playerStat
    });
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get match statistics for a specific match
router.get('/match/:matchId', (req, res) => {
  try {
    const { matchId } = req.params;
    
    const matchStats = matchPlayerStats.filter(stat => stat.match_id === matchId);
    
    res.json({
      success: true,
      data: matchStats,
      count: matchStats.length
    });
  } catch (error) {
    console.error('Error fetching match statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create/Update player statistics for a match
router.post('/match/:matchId', (req, res) => {
  try {
    const { matchId } = req.params;
    const { player_id, batting_stats, bowling_stats, fielding_stats }: CreatePlayerStatsRequest = req.body;
    
    if (!player_id || !batting_stats || !bowling_stats || !fielding_stats) {
      return res.status(400).json({
        success: false,
        message: 'Player ID and all stats are required'
      });
    }
    
    // Check if stats already exist for this player in this match
    const existingStats = matchPlayerStats.find(stat => 
      stat.match_id === matchId && stat.player_id === player_id
    );
    
    if (existingStats) {
      // Update existing stats
      existingStats.batting_stats = batting_stats;
      existingStats.bowling_stats = bowling_stats;
      existingStats.fielding_stats = fielding_stats;
      existingStats.updated_at = new Date();
      
      res.json({
        success: true,
        message: 'Player statistics updated successfully',
        data: existingStats
      });
    } else {
      // Create new stats
      const newMatchStats: MatchPlayerStats = {
        id: `match_stats_${matchStatsIdCounter++}`,
        match_id: matchId,
        player_id,
        player_name: getPlayerName(player_id),
        team_id: getTeamId(player_id),
        team_name: getTeamName(getTeamId(player_id)),
        batting_stats,
        bowling_stats,
        fielding_stats,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      matchPlayerStats.push(newMatchStats);
      
      res.status(201).json({
        success: true,
        message: 'Player statistics created successfully',
        data: newMatchStats
      });
    }
  } catch (error) {
    console.error('Error creating player statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create player statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update player statistics
router.put('/match/:matchId/player/:playerId', (req, res) => {
  try {
    const { matchId, playerId } = req.params;
    const { batting_stats, bowling_stats, fielding_stats }: UpdatePlayerStatsRequest = req.body;
    
    const matchStatsIndex = matchPlayerStats.findIndex(stat => 
      stat.match_id === matchId && stat.player_id === playerId
    );
    
    if (matchStatsIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Player match statistics not found'
      });
    }
    
    // Update the stats
    if (batting_stats) {
      matchPlayerStats[matchStatsIndex].batting_stats = {
        ...matchPlayerStats[matchStatsIndex].batting_stats,
        ...batting_stats
      };
    }
    
    if (bowling_stats) {
      matchPlayerStats[matchStatsIndex].bowling_stats = {
        ...matchPlayerStats[matchStatsIndex].bowling_stats,
        ...bowling_stats
      };
    }
    
    if (fielding_stats) {
      matchPlayerStats[matchStatsIndex].fielding_stats = {
        ...matchPlayerStats[matchStatsIndex].fielding_stats,
        ...fielding_stats
      };
    }
    
    matchPlayerStats[matchStatsIndex].updated_at = new Date();
    
    res.json({
      success: true,
      message: 'Player statistics updated successfully',
      data: matchPlayerStats[matchStatsIndex]
    });
  } catch (error) {
    console.error('Error updating player statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update player statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get player performance summary
router.get('/performance', (req, res) => {
  try {
    const { team_id, limit } = req.query;
    
    let performances: PlayerPerformance[] = [];
    
    // Calculate performance for each player
    const playerStatsMap = new Map<string, PlayerStats>();
    playerStats.forEach(stat => {
      playerStatsMap.set(stat.player_id, stat);
    });
    
    playerStatsMap.forEach((stat, playerId) => {
      if (team_id && stat.team_id !== team_id) return;
      
      const battingRank = calculateBattingRank(stat);
      const bowlingRank = calculateBowlingRank(stat);
      const allRounderRank = calculateAllRounderRank(stat);
      const recentForm = calculateRecentForm(stat);
      const achievements = calculateAchievements(stat);
      
      performances.push({
        player_id: playerId,
        player_name: stat.player_name,
        team_name: stat.team_name,
        total_matches: stat.matches_played,
        batting_rank: battingRank,
        bowling_rank: bowlingRank,
        all_rounder_rank: allRounderRank,
        recent_form: recentForm,
        key_achievements: achievements
      });
    });
    
    // Sort by all-rounder rank
    performances.sort((a, b) => a.all_rounder_rank - b.all_rounder_rank);
    
    // Apply limit if specified
    if (limit) {
      performances = performances.slice(0, parseInt(limit as string));
    }
    
    res.json({
      success: true,
      data: performances,
      count: performances.length
    });
  } catch (error) {
    console.error('Error fetching player performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player performance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get team statistics
router.get('/teams', (req, res) => {
  try {
    const teamStats: TeamStats[] = [];
    
    // Calculate team statistics
    const teamStatsMap = new Map<string, TeamStats>();
    
    // Initialize team stats
    playerStats.forEach(stat => {
      if (!teamStatsMap.has(stat.team_id)) {
        teamStatsMap.set(stat.team_id, {
          team_id: stat.team_id,
          team_name: stat.team_name,
          matches_played: 0,
          matches_won: 0,
          matches_lost: 0,
          matches_tied: 0,
          win_percentage: 0,
          total_runs_scored: 0,
          total_runs_conceded: 0,
          net_run_rate: 0,
          highest_total: 0,
          lowest_total: 0,
          best_bowling_figures: '0/0',
          top_batsman: '',
          top_bowler: ''
        });
      }
    });
    
    // Calculate aggregated stats
    teamStatsMap.forEach((teamStat, teamId) => {
      const teamPlayerStats = playerStats.filter(stat => stat.team_id === teamId);
      
      if (teamPlayerStats.length > 0) {
        teamStat.matches_played = Math.max(...teamPlayerStats.map(stat => stat.matches_played));
        teamStat.total_runs_scored = teamPlayerStats.reduce((sum, stat) => sum + stat.runs_scored, 0);
        teamStat.total_runs_conceded = teamPlayerStats.reduce((sum, stat) => sum + stat.runs_conceded, 0);
        teamStat.highest_total = Math.max(...teamPlayerStats.map(stat => stat.runs_scored));
        
        // Find top performers
        const topBatsman = teamPlayerStats.reduce((prev, current) => 
          prev.runs_scored > current.runs_scored ? prev : current
        );
        const topBowler = teamPlayerStats.reduce((prev, current) => 
          prev.wickets_taken > current.wickets_taken ? prev : current
        );
        
        teamStat.top_batsman = topBatsman.player_name;
        teamStat.top_bowler = topBowler.player_name;
      }
      
      teamStats.push(teamStat);
    });
    
    res.json({
      success: true,
      data: teamStats,
      count: teamStats.length
    });
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions
function getPlayerName(playerId: string): string {
  // This would normally query the players table
  return `Player ${playerId}`;
}

function getTeamId(playerId: string): string {
  // This would normally query the players table
  return `team_${playerId}`;
}

function getTeamName(teamId: string): string {
  // This would normally query the teams table
  return `Team ${teamId}`;
}

function calculateBattingRank(stat: PlayerStats): number {
  // Simple ranking based on batting average and runs
  const score = (stat.batting_average * 0.7) + (stat.runs_scored * 0.3);
  return Math.round(score);
}

function calculateBowlingRank(stat: PlayerStats): number {
  // Simple ranking based on bowling average and wickets
  const score = (stat.wickets_taken * 0.7) + ((100 - stat.bowling_average) * 0.3);
  return Math.round(score);
}

function calculateAllRounderRank(stat: PlayerStats): number {
  // Combined ranking for all-rounders
  const battingScore = (stat.batting_average * 0.4) + (stat.runs_scored * 0.1);
  const bowlingScore = (stat.wickets_taken * 0.4) + ((100 - stat.bowling_average) * 0.1);
  return Math.round(battingScore + bowlingScore);
}

function calculateRecentForm(stat: PlayerStats): 'excellent' | 'good' | 'average' | 'poor' {
  // Simple form calculation based on recent performance
  if (stat.batting_average > 50 && stat.bowling_average < 25) return 'excellent';
  if (stat.batting_average > 30 && stat.bowling_average < 35) return 'good';
  if (stat.batting_average > 20 && stat.bowling_average < 45) return 'average';
  return 'poor';
}

function calculateAchievements(stat: PlayerStats): string[] {
  const achievements: string[] = [];
  
  if (stat.centuries > 0) achievements.push(`${stat.centuries} century${stat.centuries > 1 ? 's' : ''}`);
  if (stat.five_wickets > 0) achievements.push(`${stat.five_wickets} five-wicket haul${stat.five_wickets > 1 ? 's' : ''}`);
  if (stat.half_centuries > 0) achievements.push(`${stat.half_centuries} half-century${stat.half_centuries > 1 ? 's' : ''}`);
  if (stat.strike_rate > 150) achievements.push('High strike rate');
  if (stat.economy_rate < 4) achievements.push('Economical bowler');
  
  return achievements;
}

export default router;
