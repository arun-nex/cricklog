'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Match } from '@/types/Match'
import { Innings, Ball, AddBallRequest, StartInningsRequest } from '@/types/Scoring'
import { Team, Player } from '@/types/Team'

export default function LiveScoringPage() {
  const params = useParams()
  const matchId = params.matchId as string
  
  const [match, setMatch] = useState<Match | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [currentInnings, setCurrentInnings] = useState<Innings | null>(null)
  const [allInnings, setAllInnings] = useState<Innings[]>([])
  const [loading, setLoading] = useState(true)
  const [showStartInnings, setShowStartInnings] = useState(false)
  const [showAddBall, setShowAddBall] = useState(false)

  useEffect(() => {
    if (matchId) {
      fetchMatchDetails()
      fetchTeams()
      fetchCurrentInnings()
    }
  }, [matchId])

  const fetchMatchDetails = async () => {
    try {
      // First try to get match from matches API
      let response = await fetch(`https://cricklog-2dk4.vercel.app/api/matches/${matchId}`)
      let data = await response.json()
      
      if (data.success) {
        setMatch(data.data)
        return
      }
      
      // If match not found in matches API, try scoring API
      response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}`)
      data = await response.json()
      
      if (data.success) {
        setMatch(data.data)
        return
      }
      
      // If still not found, create a test match
      response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}/create-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team1_name: 'Team 1',
          team2_name: 'Team 2',
          venue: 'Test Stadium'
        })
      })
      
      data = await response.json()
      
      if (data.success) {
        setMatch(data.data)
      } else {
        console.error('Failed to create test match:', data.message)
      }
    } catch (error) {
      console.error('Error fetching match:', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/teams')
      const data = await response.json()
      
      if (data.success) {
        setTeams(data.data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchCurrentInnings = async () => {
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}/innings/current`)
      const data = await response.json()
      
      if (data.success) {
        setCurrentInnings(data.data)
      } else {
        setCurrentInnings(null)
      }
    } catch (error) {
      console.error('Error fetching current innings:', error)
      setCurrentInnings(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllInnings = async () => {
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}/innings`)
      const data = await response.json()
      
      if (data.success) {
        setAllInnings(data.data)
      }
    } catch (error) {
      console.error('Error fetching innings:', error)
    }
  }

  const startInnings = async (inningsData: StartInningsRequest) => {
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}/innings/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inningsData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentInnings(data.data)
        setShowStartInnings(false)
        fetchAllInnings()
        alert('Innings started successfully!')
      } else {
        alert('Failed to start innings: ' + data.message)
      }
    } catch (error) {
      console.error('Error starting innings:', error)
      alert('Failed to start innings')
    }
  }

  const addBall = async (ballData: AddBallRequest) => {
    try {
      if (!currentInnings) return

      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}/innings/${currentInnings.id}/ball`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ballData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentInnings(data.data.innings)
        fetchAllInnings()
        setShowAddBall(false)
      } else {
        alert('Failed to add ball: ' + data.message)
      }
    } catch (error) {
      console.error('Error adding ball:', error)
      alert('Failed to add ball')
    }
  }

  const completeInnings = async () => {
    try {
      if (!currentInnings) return

      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/scoring/${matchId}/innings/${currentInnings.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentInnings(null)
        fetchAllInnings()
        alert('Innings completed successfully!')
      } else {
        alert('Failed to complete innings: ' + data.message)
      }
    } catch (error) {
      console.error('Error completing innings:', error)
      alert('Failed to complete innings')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading match details...</div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Match not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <span className="text-3xl">🏏</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{match.name}</h1>
          <p className="text-white/70 text-lg">
            {match.team1_name} vs {match.team2_name}
          </p>
          <div className="text-white/60 text-sm mt-2">
            {match.venue && `${match.venue} • `}
            {new Date(match.date).toLocaleDateString()} • {match.match_type}
          </div>
        </div>

        {/* Match Status */}
        <div className="mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            match.status === 'live' ? 'bg-green-500/20 text-green-300' :
            match.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-300' :
            match.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
            'bg-red-500/20 text-red-300'
          }`}>
            {match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()}
          </div>
        </div>

        {/* Current Innings Display */}
        {currentInnings ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentInnings.team_name} - Innings {currentInnings.innings_number}
              </h2>
              <div className="text-4xl font-bold text-white mb-2">
                {currentInnings.total_runs}/{currentInnings.total_wickets}
              </div>
              <div className="text-white/70">
                {currentInnings.total_overs} overs ({currentInnings.balls_bowled} balls)
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowAddBall(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Add Ball
              </button>
              <button
                onClick={completeInnings}
                className="bg-red-500/20 text-red-300 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300"
              >
                Complete Innings
              </button>
            </div>

            {/* Recent Balls */}
            {currentInnings.balls && currentInnings.balls.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Balls</h3>
                <div className="grid grid-cols-6 gap-2">
                  {currentInnings.balls.slice(-12).map((ball, index) => (
                    <div key={ball.id} className={`p-2 rounded-lg text-center text-sm font-semibold ${
                      ball.is_wicket ? 'bg-red-500/20 text-red-300' :
                      ball.runs === 0 ? 'bg-gray-500/20 text-gray-300' :
                      ball.runs === 4 ? 'bg-blue-500/20 text-blue-300' :
                      ball.runs === 6 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {ball.runs === 0 ? '•' : ball.runs}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 text-center">
            <div className="text-white/70 text-lg mb-4">No active innings</div>
            <button
              onClick={() => setShowStartInnings(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Innings
            </button>
          </div>
        )}

        {/* All Innings Summary */}
        {allInnings.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Match Summary</h3>
            <div className="space-y-4">
              {allInnings.map((innings) => (
                <div key={innings.id} className="bg-white/5 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-white">
                      {innings.team_name} - Innings {innings.innings_number}
                    </h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      innings.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                      innings.status === 'in_progress' ? 'bg-green-500/20 text-green-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {innings.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {innings.total_runs}/{innings.total_wickets}
                  </div>
                  <div className="text-white/70">
                    {innings.total_overs} overs ({innings.balls_bowled} balls)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Innings Modal */}
      {showStartInnings && (
        <StartInningsModal
          teams={teams}
          match={match}
          onClose={() => setShowStartInnings(false)}
          onStart={startInnings}
        />
      )}

      {/* Add Ball Modal */}
      {showAddBall && currentInnings && (
        <AddBallModal
          innings={currentInnings}
          teams={teams}
          onClose={() => setShowAddBall(false)}
          onAdd={addBall}
        />
      )}
    </div>
  )
}

// Start Innings Modal Component
function StartInningsModal({ teams, match, onClose, onStart }: { 
  teams: Team[]; 
  match: Match; 
  onClose: () => void; 
  onStart: (data: StartInningsRequest) => void 
}) {
  const [selectedTeam, setSelectedTeam] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTeam) {
      const team = teams.find(t => t.id === selectedTeam)
      if (team) {
        onStart({
          team_id: team.id,
          team_name: team.name
        })
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Innings</h2>
            <p className="text-gray-600">Select which team will bat first</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Batting Team *
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
              required
            >
              <option value="">Select batting team</option>
              <option value={match.team1_id}>{match.team1_name}</option>
              <option value={match.team2_id}>{match.team2_name}</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Innings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Ball Modal Component
function AddBallModal({ innings, teams, onClose, onAdd }: { 
  innings: Innings; 
  teams: Team[]; 
  onClose: () => void; 
  onAdd: (data: AddBallRequest) => void 
}) {
  const [formData, setFormData] = useState<AddBallRequest>({
    over_number: Math.floor(innings.balls_bowled / 6) + 1,
    ball_number: (innings.balls_bowled % 6) + 1,
    bowler_id: '',
    bowler_name: '',
    batsman_id: '',
    batsman_name: '',
    runs: 0,
    is_wicket: false,
    wicket_type: 'bowled',
    wicket_taker_id: '',
    wicket_taker_name: '',
    extras: undefined
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  const currentTeam = teams.find(t => t.id === innings.team_id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Ball</h2>
            <p className="text-gray-600">Record the ball details for {innings.team_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Over Number
              </label>
              <input
                type="number"
                value={formData.over_number}
                onChange={(e) => setFormData({ ...formData, over_number: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ball Number
              </label>
              <input
                type="number"
                value={formData.ball_number}
                onChange={(e) => setFormData({ ...formData, ball_number: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                min="1"
                max="6"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Bowler
              </label>
              <select
                value={formData.bowler_id}
                onChange={(e) => {
                  const bowler = currentTeam?.players?.find(p => p.id === e.target.value)
                  setFormData({ 
                    ...formData, 
                    bowler_id: e.target.value,
                    bowler_name: bowler?.name || ''
                  })
                }}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                required
              >
                <option value="">Select bowler</option>
                {currentTeam?.players?.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Batsman
              </label>
              <select
                value={formData.batsman_id}
                onChange={(e) => {
                  const batsman = currentTeam?.players?.find(p => p.id === e.target.value)
                  setFormData({ 
                    ...formData, 
                    batsman_id: e.target.value,
                    batsman_name: batsman?.name || ''
                  })
                }}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                required
              >
                <option value="">Select batsman</option>
                {currentTeam?.players?.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Runs Scored
            </label>
            <div className="grid grid-cols-7 gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map(runs => (
                <button
                  key={runs}
                  type="button"
                  onClick={() => setFormData({ ...formData, runs })}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                    formData.runs === runs 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {runs}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_wicket}
                onChange={(e) => setFormData({ ...formData, is_wicket: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">Wicket</span>
            </label>
          </div>

          {formData.is_wicket && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Wicket Type
              </label>
              <select
                value={formData.wicket_type}
                onChange={(e) => setFormData({ ...formData, wicket_type: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
              >
                <option value="bowled">Bowled</option>
                <option value="caught">Caught</option>
                <option value="lbw">LBW</option>
                <option value="run_out">Run Out</option>
                <option value="stumped">Stumped</option>
                <option value="hit_wicket">Hit Wicket</option>
                <option value="retired_hurt">Retired Hurt</option>
              </select>
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Add Ball
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
