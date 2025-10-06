"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock data for now (we'll replace with database later)
let teams = [];
let players = [];
let teamIdCounter = 1;
let playerIdCounter = 1;
// Get all teams
router.get('/', (req, res) => {
    try {
        const teamsWithPlayers = teams.map(team => ({
            ...team,
            players: players.filter(player => player.team_id === team.id)
        }));
        res.json({
            success: true,
            data: teamsWithPlayers,
            count: teamsWithPlayers.length
        });
    }
    catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teams',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get team by ID
router.get('/:id', (req, res) => {
    try {
        const team = teams.find(t => t.id === req.params.id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        const teamWithPlayers = {
            ...team,
            players: players.filter(player => player.team_id === team.id)
        };
        res.json({
            success: true,
            data: teamWithPlayers
        });
    }
    catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Create new team
router.post('/', (req, res) => {
    try {
        const { name, description, captain } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Team name is required'
            });
        }
        const newTeam = {
            id: `team_${teamIdCounter++}`,
            name: name.trim(),
            description: description?.trim(),
            captain: captain?.trim(),
            created_at: new Date(),
            updated_at: new Date(),
            players: []
        };
        teams.push(newTeam);
        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: newTeam
        });
    }
    catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create team',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Update team
router.put('/:id', (req, res) => {
    try {
        const teamIndex = teams.findIndex(t => t.id === req.params.id);
        if (teamIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        const { name, description, captain } = req.body;
        if (name && name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Team name cannot be empty'
            });
        }
        teams[teamIndex] = {
            ...teams[teamIndex],
            name: name?.trim() || teams[teamIndex].name,
            description: description?.trim() || teams[teamIndex].description,
            captain: captain?.trim() || teams[teamIndex].captain,
            updated_at: new Date()
        };
        res.json({
            success: true,
            message: 'Team updated successfully',
            data: teams[teamIndex]
        });
    }
    catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update team',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Delete team
router.delete('/:id', (req, res) => {
    try {
        const teamIndex = teams.findIndex(t => t.id === req.params.id);
        if (teamIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        // Remove all players from this team
        players = players.filter(player => player.team_id !== req.params.id);
        // Remove the team
        teams.splice(teamIndex, 1);
        res.json({
            success: true,
            message: 'Team deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete team',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Add player to team
router.post('/:id/players', (req, res) => {
    try {
        const team = teams.find(t => t.id === req.params.id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        const { name, role, batting_style, bowling_style, jersey_number } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Player name is required'
            });
        }
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Player role is required'
            });
        }
        const newPlayer = {
            id: `player_${playerIdCounter++}`,
            team_id: req.params.id,
            name: name.trim(),
            role,
            batting_style,
            bowling_style,
            jersey_number,
            created_at: new Date(),
            updated_at: new Date()
        };
        players.push(newPlayer);
        res.status(201).json({
            success: true,
            message: 'Player added successfully',
            data: newPlayer
        });
    }
    catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add player',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get players for a team
router.get('/:id/players', (req, res) => {
    try {
        const team = teams.find(t => t.id === req.params.id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        const teamPlayers = players.filter(player => player.team_id === req.params.id);
        res.json({
            success: true,
            data: teamPlayers,
            count: teamPlayers.length
        });
    }
    catch (error) {
        console.error('Error fetching team players:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team players',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=teams.js.map