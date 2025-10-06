"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock data (in production, this would be database queries)
let matches = [];
let innings = [];
let balls = [];
let inningsIdCounter = 1;
let ballIdCounter = 1;
// Start innings for a match
router.post('/:matchId/innings/start', (req, res) => {
    try {
        const { matchId } = req.params;
        const { team_id, team_name } = req.body;
        if (!team_id || !team_name) {
            return res.status(400).json({
                success: false,
                message: 'Team ID and name are required'
            });
        }
        // Check if match exists and is live
        const match = matches.find(m => m.id === matchId);
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        if (match.status !== 'live') {
            return res.status(400).json({
                success: false,
                message: 'Match must be live to start innings'
            });
        }
        // Check if innings already exists for this team
        const existingInnings = innings.find(i => i.match_id === matchId && i.team_id === team_id);
        if (existingInnings) {
            return res.status(400).json({
                success: false,
                message: 'Innings already exists for this team'
            });
        }
        // Create new innings
        const newInnings = {
            id: `innings_${inningsIdCounter++}`,
            match_id: matchId,
            team_id,
            team_name,
            innings_number: innings.filter(i => i.match_id === matchId).length + 1,
            total_runs: 0,
            total_wickets: 0,
            total_overs: 0,
            balls_bowled: 0,
            status: 'in_progress',
            created_at: new Date(),
            updated_at: new Date(),
            balls: []
        };
        innings.push(newInnings);
        res.status(201).json({
            success: true,
            message: 'Innings started successfully',
            data: newInnings
        });
    }
    catch (error) {
        console.error('Error starting innings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start innings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Add ball to innings
router.post('/:matchId/innings/:inningsId/ball', (req, res) => {
    try {
        const { matchId, inningsId } = req.params;
        const { over_number, ball_number, bowler_id, bowler_name, batsman_id, batsman_name, runs, is_wicket, wicket_type, wicket_taker_id, wicket_taker_name, extras } = req.body;
        // Validate required fields
        if (over_number === undefined || ball_number === undefined || !bowler_id || !bowler_name || !batsman_id || !batsman_name || runs === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: over_number, ball_number, bowler_id, bowler_name, batsman_id, batsman_name, runs'
            });
        }
        // Find innings
        const inningsIndex = innings.findIndex(i => i.id === inningsId && i.match_id === matchId);
        if (inningsIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Innings not found'
            });
        }
        const currentInnings = innings[inningsIndex];
        if (currentInnings.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: 'Innings is not in progress'
            });
        }
        // Create new ball
        const newBall = {
            id: `ball_${ballIdCounter++}`,
            innings_id: inningsId,
            over_number,
            ball_number,
            bowler_id,
            bowler_name,
            batsman_id,
            batsman_name,
            runs,
            is_wicket: is_wicket || false,
            wicket_type,
            wicket_taker_id,
            wicket_taker_name,
            extras,
            created_at: new Date()
        };
        balls.push(newBall);
        // Update innings totals
        currentInnings.total_runs += runs;
        if (is_wicket) {
            currentInnings.total_wickets += 1;
        }
        // Update overs and balls
        currentInnings.balls_bowled += 1;
        currentInnings.total_overs = Math.floor(currentInnings.balls_bowled / 6) + (currentInnings.balls_bowled % 6) / 10;
        currentInnings.updated_at = new Date();
        // Update innings in array
        innings[inningsIndex] = currentInnings;
        res.status(201).json({
            success: true,
            message: 'Ball added successfully',
            data: {
                ball: newBall,
                innings: currentInnings
            }
        });
    }
    catch (error) {
        console.error('Error adding ball:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add ball',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get current innings for a match
router.get('/:matchId/innings/current', (req, res) => {
    try {
        const { matchId } = req.params;
        const currentInnings = innings.find(i => i.match_id === matchId && i.status === 'in_progress');
        if (!currentInnings) {
            return res.status(404).json({
                success: false,
                message: 'No active innings found'
            });
        }
        // Get all balls for this innings
        const inningsBalls = balls.filter(b => b.innings_id === currentInnings.id);
        res.json({
            success: true,
            data: {
                ...currentInnings,
                balls: inningsBalls
            }
        });
    }
    catch (error) {
        console.error('Error fetching current innings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch current innings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get all innings for a match
router.get('/:matchId/innings', (req, res) => {
    try {
        const { matchId } = req.params;
        const matchInnings = innings.filter(i => i.match_id === matchId);
        // Get balls for each innings
        const inningsWithBalls = matchInnings.map(innings => ({
            ...innings,
            balls: balls.filter(b => b.innings_id === innings.id)
        }));
        res.json({
            success: true,
            data: inningsWithBalls
        });
    }
    catch (error) {
        console.error('Error fetching innings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch innings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Complete innings
router.post('/:matchId/innings/:inningsId/complete', (req, res) => {
    try {
        const { matchId, inningsId } = req.params;
        const inningsIndex = innings.findIndex(i => i.id === inningsId && i.match_id === matchId);
        if (inningsIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Innings not found'
            });
        }
        innings[inningsIndex].status = 'completed';
        innings[inningsIndex].updated_at = new Date();
        res.json({
            success: true,
            message: 'Innings completed successfully',
            data: innings[inningsIndex]
        });
    }
    catch (error) {
        console.error('Error completing innings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete innings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get match scorecard
router.get('/:matchId/scorecard', (req, res) => {
    try {
        const { matchId } = req.params;
        const matchInnings = innings.filter(i => i.match_id === matchId);
        const matchBalls = balls.filter(b => {
            const inningsIds = matchInnings.map(i => i.id);
            return inningsIds.includes(b.innings_id);
        });
        // Calculate team scores
        const teamScores = matchInnings.map(innings => ({
            team_id: innings.team_id,
            team_name: innings.team_name,
            innings_number: innings.innings_number,
            total_runs: innings.total_runs,
            total_wickets: innings.total_wickets,
            total_overs: innings.total_overs,
            balls_bowled: innings.balls_bowled,
            status: innings.status,
            balls: matchBalls.filter(b => b.innings_id === innings.id)
        }));
        res.json({
            success: true,
            data: {
                match_id: matchId,
                innings: teamScores
            }
        });
    }
    catch (error) {
        console.error('Error fetching scorecard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scorecard',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=scoring.js.map