"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock data for now (we'll replace with database later)
let matches = [];
let innings = [];
let balls = [];
let matchIdCounter = 1;
let inningsIdCounter = 1;
let ballIdCounter = 1;
// Get all matches
router.get('/', (req, res) => {
    try {
        const matchSummaries = matches.map(match => ({
            id: match.id,
            name: match.name,
            team1_name: match.team1_name,
            team2_name: match.team2_name,
            match_type: match.match_type,
            venue: match.venue,
            date: match.date,
            status: match.status,
            team1_score: getTeamScore(match.id, match.team1_id),
            team2_score: getTeamScore(match.id, match.team2_id),
            current_innings: getCurrentInnings(match.id),
            overs_bowled: getOversBowled(match.id),
            target: getTarget(match.id, match.team1_id, match.team2_id)
        }));
        res.json({
            success: true,
            data: matchSummaries,
            count: matchSummaries.length
        });
    }
    catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch matches',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get match by ID
router.get('/:id', (req, res) => {
    try {
        const match = matches.find(m => m.id === req.params.id);
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        const matchWithDetails = {
            ...match,
            innings: innings.filter(i => i.match_id === match.id),
            balls: balls.filter(b => {
                const inningsIds = innings.filter(i => i.match_id === match.id).map(i => i.id);
                return inningsIds.includes(b.innings_id);
            })
        };
        res.json({
            success: true,
            data: matchWithDetails
        });
    }
    catch (error) {
        console.error('Error fetching match:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch match',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Create new match
router.post('/', (req, res) => {
    try {
        const { name, description, team1_id, team2_id, match_type, overs, venue, date } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Match name is required'
            });
        }
        if (!team1_id || !team2_id) {
            return res.status(400).json({
                success: false,
                message: 'Both teams are required'
            });
        }
        if (team1_id === team2_id) {
            return res.status(400).json({
                success: false,
                message: 'A team cannot play against itself'
            });
        }
        // Validate overs for T20, ODI, and Custom matches
        if ((match_type === 'T20' || match_type === 'ODI' || match_type === 'Custom') && !overs) {
            return res.status(400).json({
                success: false,
                message: 'Overs are required for T20, ODI, and Custom matches'
            });
        }
        const newMatch = {
            id: `match_${matchIdCounter++}`,
            name: name.trim(),
            description: description?.trim(),
            team1_id,
            team2_id,
            team1_name: getTeamName(team1_id),
            team2_name: getTeamName(team2_id),
            match_type,
            overs: match_type === 'Test' ? undefined : overs,
            venue: venue?.trim(),
            date: new Date(date),
            status: 'scheduled',
            created_at: new Date(),
            updated_at: new Date(),
            innings: []
        };
        matches.push(newMatch);
        res.status(201).json({
            success: true,
            message: 'Match created successfully',
            data: newMatch
        });
    }
    catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create match',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Update match
router.put('/:id', (req, res) => {
    try {
        const matchIndex = matches.findIndex(m => m.id === req.params.id);
        if (matchIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        const { name, description, venue, date, status, toss_winner, toss_decision } = req.body;
        if (name && name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Match name cannot be empty'
            });
        }
        matches[matchIndex] = {
            ...matches[matchIndex],
            name: name?.trim() || matches[matchIndex].name,
            description: description?.trim() || matches[matchIndex].description,
            venue: venue?.trim() || matches[matchIndex].venue,
            date: date ? new Date(date) : matches[matchIndex].date,
            status: status || matches[matchIndex].status,
            toss_winner: toss_winner || matches[matchIndex].toss_winner,
            toss_decision: toss_decision || matches[matchIndex].toss_decision,
            updated_at: new Date()
        };
        res.json({
            success: true,
            message: 'Match updated successfully',
            data: matches[matchIndex]
        });
    }
    catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update match',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Delete match
router.delete('/:id', (req, res) => {
    try {
        const matchIndex = matches.findIndex(m => m.id === req.params.id);
        if (matchIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        // Remove all related data
        const matchInnings = innings.filter(i => i.match_id === req.params.id);
        const inningsIds = matchInnings.map(i => i.id);
        balls = balls.filter(b => !inningsIds.includes(b.innings_id));
        innings = innings.filter(i => i.match_id !== req.params.id);
        // Remove the match
        matches.splice(matchIndex, 1);
        res.json({
            success: true,
            message: 'Match deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete match',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Start match
router.post('/:id/start', (req, res) => {
    try {
        const matchIndex = matches.findIndex(m => m.id === req.params.id);
        if (matchIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        if (matches[matchIndex].status !== 'scheduled') {
            return res.status(400).json({
                success: false,
                message: 'Only scheduled matches can be started'
            });
        }
        matches[matchIndex].status = 'live';
        matches[matchIndex].updated_at = new Date();
        res.json({
            success: true,
            message: 'Match started successfully',
            data: matches[matchIndex]
        });
    }
    catch (error) {
        console.error('Error starting match:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start match',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Helper functions (these would normally query the database)
function getTeamName(teamId) {
    // This would normally query the teams table
    return `Team ${teamId}`;
}
function getTeamScore(matchId, teamId) {
    const matchInnings = innings.filter(i => i.match_id === matchId && i.team_id === teamId);
    if (matchInnings.length === 0)
        return '0/0';
    const latestInnings = matchInnings[matchInnings.length - 1];
    return `${latestInnings.total_runs}/${latestInnings.total_wickets}`;
}
function getCurrentInnings(matchId) {
    const matchInnings = innings.filter(i => i.match_id === matchId);
    if (matchInnings.length === 0)
        return 'Not started';
    const currentInnings = matchInnings.find(i => i.status === 'in_progress');
    if (!currentInnings)
        return 'Completed';
    return `${currentInnings.team_name} - ${currentInnings.total_runs}/${currentInnings.total_wickets}`;
}
function getOversBowled(matchId) {
    const matchInnings = innings.filter(i => i.match_id === matchId);
    if (matchInnings.length === 0)
        return 0;
    return matchInnings.reduce((total, innings) => total + innings.total_overs, 0);
}
function getTarget(matchId, team1Id, team2Id) {
    const team1Innings = innings.filter(i => i.match_id === matchId && i.team_id === team1Id);
    const team2Innings = innings.filter(i => i.match_id === matchId && i.team_id === team2Id);
    if (team1Innings.length > 0 && team2Innings.length === 0) {
        return team1Innings[0].total_runs + 1;
    }
    return undefined;
}
exports.default = router;
//# sourceMappingURL=matches.js.map