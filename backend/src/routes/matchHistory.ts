import express from 'express';
import { MatchHistory, MatchReport, MatchFilter, MatchHistorySummary } from '../models/MatchHistory';

const router = express.Router();

// Mock data (in production, this would be database queries)
let matchHistory: MatchHistory[] = [];
let historyIdCounter = 1;

// Get match history with filters
router.get('/', (req, res) => {
  try {
    const { 
      team_id, 
      match_type, 
      status, 
      date_from, 
      date_to, 
      venue, 
      result_type,
      limit = '20',
      offset = '0'
    } = req.query;
    
    let filteredMatches = [...matchHistory];
    
    // Apply filters
    if (team_id) {
      filteredMatches = filteredMatches.filter(match => 
        match.team1_id === team_id || match.team2_id === team_id
      );
    }
    
    if (match_type) {
      filteredMatches = filteredMatches.filter(match => match.match_type === match_type);
    }
    
    if (status) {
      filteredMatches = filteredMatches.filter(match => match.status === status);
    }
    
    if (date_from) {
      const fromDate = new Date(date_from as string);
      filteredMatches = filteredMatches.filter(match => match.date >= fromDate);
    }
    
    if (date_to) {
      const toDate = new Date(date_to as string);
      filteredMatches = filteredMatches.filter(match => match.date <= toDate);
    }
    
    if (venue) {
      filteredMatches = filteredMatches.filter(match => 
        match.venue?.toLowerCase().includes((venue as string).toLowerCase())
      );
    }
    
    if (result_type) {
      filteredMatches = filteredMatches.filter(match => 
        match.result.result_type === result_type
      );
    }
    
    // Sort by date (newest first)
    filteredMatches.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedMatches = filteredMatches.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedMatches,
      count: paginatedMatches.length,
      total: filteredMatches.length,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: filteredMatches.length
      }
    });
  } catch (error) {
    console.error('Error fetching match history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get detailed match report
router.get('/:matchId/report', (req, res) => {
  try {
    const { matchId } = req.params;
    
    const match = matchHistory.find(m => m.id === matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    
    // Generate detailed match report
    const matchReport = generateMatchReport(match);
    
    res.json({
      success: true,
      data: matchReport
    });
  } catch (error) {
    console.error('Error fetching match report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get match history summary
router.get('/summary', (req, res) => {
  try {
    const { team_id, date_from, date_to } = req.query;
    
    let filteredMatches = [...matchHistory];
    
    // Apply filters
    if (team_id) {
      filteredMatches = filteredMatches.filter(match => 
        match.team1_id === team_id || match.team2_id === team_id
      );
    }
    
    if (date_from) {
      const fromDate = new Date(date_from as string);
      filteredMatches = filteredMatches.filter(match => match.date >= fromDate);
    }
    
    if (date_to) {
      const toDate = new Date(date_to as string);
      filteredMatches = filteredMatches.filter(match => match.date <= toDate);
    }
    
    const summary = generateMatchHistorySummary(filteredMatches);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching match history summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match history summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get team head-to-head record
router.get('/head-to-head/:team1Id/:team2Id', (req, res) => {
  try {
    const { team1Id, team2Id } = req.params;
    
    const headToHeadMatches = matchHistory.filter(match => 
      (match.team1_id === team1Id && match.team2_id === team2Id) ||
      (match.team1_id === team2Id && match.team2_id === team1Id)
    );
    
    const team1Wins = headToHeadMatches.filter(match => 
      match.result.winner === team1Id
    ).length;
    
    const team2Wins = headToHeadMatches.filter(match => 
      match.result.winner === team2Id
    ).length;
    
    const ties = headToHeadMatches.filter(match => 
      match.result.result_type === 'tied'
    ).length;
    
    res.json({
      success: true,
      data: {
        team1_id: team1Id,
        team2_id: team2Id,
        total_matches: headToHeadMatches.length,
        team1_wins: team1Wins,
        team2_wins: team2Wins,
        ties: ties,
        matches: headToHeadMatches
      }
    });
  } catch (error) {
    console.error('Error fetching head-to-head record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch head-to-head record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get recent matches for a team
router.get('/team/:teamId/recent', (req, res) => {
  try {
    const { teamId } = req.params;
    const { limit = '10' } = req.query;
    
    const teamMatches = matchHistory
      .filter(match => 
        match.team1_id === teamId || match.team2_id === teamId
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, parseInt(limit as string));
    
    res.json({
      success: true,
      data: teamMatches,
      count: teamMatches.length
    });
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent matches',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get match statistics by venue
router.get('/venue/:venue/stats', (req, res) => {
  try {
    const { venue } = req.params;
    
    const venueMatches = matchHistory.filter(match => 
      match.venue?.toLowerCase().includes(venue.toLowerCase())
    );
    
    const venueStats = {
      venue,
      total_matches: venueMatches.length,
      average_score: calculateAverageScore(venueMatches),
      highest_score: calculateHighestScore(venueMatches),
      most_common_result: calculateMostCommonResult(venueMatches),
      matches: venueMatches
    };
    
    res.json({
      success: true,
      data: venueStats
    });
  } catch (error) {
    console.error('Error fetching venue statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch venue statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions
function generateMatchReport(match: MatchHistory): MatchReport {
  // This would normally generate a detailed report from match data
  return {
    match_id: match.id,
    match_name: match.match_name,
    date: match.date,
    venue: match.venue,
    teams: {
      team1: {
        team_id: match.team1_id,
        team_name: match.team1_name,
        innings: [],
        total_score: 0,
        total_wickets: 0,
        total_overs: 0,
        run_rate: 0,
        top_performers: {
          batsman: { player_id: '', player_name: '', runs: 0, balls: 0 },
          bowler: { player_id: '', player_name: '', wickets: 0, overs: 0 }
        }
      },
      team2: {
        team_id: match.team2_id,
        team_name: match.team2_name,
        innings: [],
        total_score: 0,
        total_wickets: 0,
        total_overs: 0,
        run_rate: 0,
        top_performers: {
          batsman: { player_id: '', player_name: '', runs: 0, balls: 0 },
          bowler: { player_id: '', player_name: '', wickets: 0, overs: 0 }
        }
      }
    },
    result: match.result,
    highlights: [],
    statistics: {
      total_balls: 0,
      total_boundaries: 0,
      total_sixes: 0,
      total_fours: 0,
      total_wides: 0,
      total_no_balls: 0,
      average_runs_per_over: 0,
      highest_partnership: 0,
      longest_partnership: 0,
      fastest_fifty: 0,
      fastest_century: 0,
      most_economical_spell: 0,
      most_expensive_spell: 0
    },
    timeline: []
  };
}

function generateMatchHistorySummary(matches: MatchHistory[]): MatchHistorySummary {
  const completedMatches = matches.filter(m => m.status === 'completed');
  const liveMatches = matches.filter(m => m.status === 'live');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  
  const totalRuns = completedMatches.reduce((sum, match) => 
    sum + match.result.innings_summary.reduce((teamSum, innings) => teamSum + innings.total_runs, 0), 0
  );
  
  const totalWickets = completedMatches.reduce((sum, match) => 
    sum + match.result.innings_summary.reduce((teamSum, innings) => teamSum + innings.total_wickets, 0), 0
  );
  
  const averageScore = completedMatches.length > 0 ? totalRuns / completedMatches.length : 0;
  
  const highestScore = Math.max(...completedMatches.map(match => 
    Math.max(...match.result.innings_summary.map(innings => innings.total_runs))
  ));
  
  return {
    total_matches: matches.length,
    completed_matches: completedMatches.length,
    live_matches: liveMatches.length,
    scheduled_matches: scheduledMatches.length,
    total_runs: totalRuns,
    total_wickets: totalWickets,
    average_score: averageScore,
    highest_score: highestScore,
    most_runs_by_player: 'Player Name', // Would be calculated from actual data
    most_wickets_by_player: 'Player Name', // Would be calculated from actual data
    most_matches_played: 'Player Name' // Would be calculated from actual data
  };
}

function calculateAverageScore(matches: MatchHistory[]): number {
  if (matches.length === 0) return 0;
  
  const totalRuns = matches.reduce((sum, match) => 
    sum + match.result.innings_summary.reduce((teamSum, innings) => teamSum + innings.total_runs, 0), 0
  );
  
  return totalRuns / matches.length;
}

function calculateHighestScore(matches: MatchHistory[]): number {
  if (matches.length === 0) return 0;
  
  return Math.max(...matches.map(match => 
    Math.max(...match.result.innings_summary.map(innings => innings.total_runs))
  ));
}

function calculateMostCommonResult(matches: MatchHistory[]): string {
  if (matches.length === 0) return 'No matches';
  
  const resultCounts = matches.reduce((counts, match) => {
    const result = match.result.result_type;
    counts[result] = (counts[result] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return Object.entries(resultCounts).reduce((a, b) => 
    resultCounts[a[0]] > resultCounts[b[0]] ? a : b
  )[0];
}

export default router;
