'use client'

import { useState, useEffect } from 'react'
import { Match, MatchSummary, CreateMatchRequest } from '@/types/Match'
import { Team } from '@/types/Team'

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  // Fetch matches and teams on component mount
  useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/matches')
      const data = await response.json()
      
      if (data.success) {
        setMatches(data.data)
      } else {
        console.error('Failed to fetch matches:', data.message)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
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

  const createMatch = async (matchData: CreateMatchRequest) => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMatches([...matches, data.data])
        setShowCreateForm(false)
        alert('Match created successfully!')
      } else {
        alert('Failed to create match: ' + data.message)
      }
    } catch (error) {
      console.error('Error creating match:', error)
      alert('Failed to create match')
    }
  }

  const startMatch = async (matchId: string) => {
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/matches/${matchId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchMatches() // Refresh matches list
        alert('Match started successfully!')
      } else {
        alert('Failed to start match: ' + data.message)
      }
    } catch (error) {
      console.error('Error starting match:', error)
      alert('Failed to start match')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading matches...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Match Management
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Create and manage cricket matches between teams
          </p>
        </div>

        {/* Create Match Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Match</span>
            </span>
          </button>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">{match.name}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  match.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-300' :
                  match.status === 'live' ? 'bg-green-500/20 text-green-300' :
                  match.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {match.status.toUpperCase()}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">{match.team1_name}</span>
                  <span className="text-white font-bold">{match.team1_score || '0/0'}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/70">{match.team2_name}</span>
                  <span className="text-white font-bold">{match.team2_score || '0/0'}</span>
                </div>
                <div className="text-center text-white/60 text-sm">
                  {match.current_innings || 'Not started'}
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-semibold">{match.match_type}</span>
                </div>
                {match.venue && (
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <span className="font-semibold">{match.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-semibold">{new Date(match.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedMatch(match as any)}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                >
                  View Details
                </button>
                {match.status === 'scheduled' && (
                  <button
                    onClick={() => startMatch(match.id)}
                    className="bg-green-500/20 text-green-300 py-3 px-4 rounded-xl font-semibold hover:bg-green-500/30 transition-all duration-300"
                  >
                    Start
                  </button>
                )}
                {match.status === 'live' && (
                  <a
                    href={`/scoring/${match.id}`}
                    className="bg-red-500/20 text-red-300 py-3 px-4 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 text-center"
                  >
                    Live Score
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Matches Message */}
        {matches.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
              <div className="text-6xl mb-6">🏆</div>
              <div className="text-white/60 text-xl mb-6 font-medium">
                No matches created yet
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your First Match
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Match Modal */}
      {showCreateForm && (
        <CreateMatchModal
          teams={teams}
          onClose={() => setShowCreateForm(false)}
          onCreate={createMatch}
        />
      )}

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  )
}

// Create Match Modal Component
function CreateMatchModal({ teams, onClose, onCreate }: { teams: Team[]; onClose: () => void; onCreate: (data: CreateMatchRequest) => void }) {
  const [formData, setFormData] = useState<CreateMatchRequest>({
    name: '',
    description: '',
    team1_id: '',
    team2_id: '',
    match_type: 'T20',
    overs: 20,
    venue: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.team1_id && formData.team2_id) {
      onCreate(formData)
      setFormData({
        name: '',
        description: '',
        team1_id: '',
        team2_id: '',
        match_type: 'T20',
        overs: 20,
        venue: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Match</h2>
            <p className="text-gray-600">Set up a cricket match between two teams</p>
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
                Match Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
                placeholder="Enter match name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all text-lg bg-white text-black placeholder-gray-600 font-medium"
                placeholder="Enter venue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all resize-none bg-white text-black placeholder-gray-600 font-medium"
              placeholder="Enter match description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Team 1 *
              </label>
              <select
                value={formData.team1_id}
                onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                required
              >
                <option value="">Select Team 1</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Team 2 *
              </label>
              <select
                value={formData.team2_id}
                onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                required
              >
                <option value="">Select Team 2</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Match Type *
              </label>
              <select
                value={formData.match_type}
                onChange={(e) => setFormData({ ...formData, match_type: e.target.value as any, overs: e.target.value === 'Test' ? undefined : (e.target.value === 'T20' ? 20 : e.target.value === 'ODI' ? 50 : 20) })}
                className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
              >
                <option value="T20">T20 (20 Overs)</option>
                <option value="ODI">ODI (50 Overs)</option>
                <option value="Test">Test Match</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {formData.match_type !== 'Test' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Overs {formData.match_type === 'Custom' ? '*' : ''}
                </label>
                <input
                  type="number"
                  value={formData.overs || ''}
                  onChange={(e) => setFormData({ ...formData, overs: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black placeholder-gray-600 font-medium"
                  placeholder="Enter overs"
                  min="1"
                  max="100"
                  required={formData.match_type === 'Custom'}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Match Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
              required
            />
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
              Create Match
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Match Details Modal Component
function MatchDetailsModal({ match, onClose }: { match: Match; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{match.name}</h2>
            {match.description && (
              <p className="text-gray-600 text-lg">{match.description}</p>
            )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{match.team1_name}</h3>
            <div className="text-3xl font-bold text-blue-600">0/0</div>
            <div className="text-sm text-gray-600">0.0 overs</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{match.team2_name}</h3>
            <div className="text-3xl font-bold text-green-600">0/0</div>
            <div className="text-sm text-gray-600">0.0 overs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Match Type</div>
            <div className="text-lg font-semibold text-gray-900">{match.match_type}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className={`text-lg font-semibold ${
              match.status === 'scheduled' ? 'text-yellow-600' :
              match.status === 'live' ? 'text-green-600' :
              match.status === 'completed' ? 'text-blue-600' :
              'text-red-600'
            }`}>
              {match.status.toUpperCase()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Date</div>
            <div className="text-lg font-semibold text-gray-900">{new Date(match.date).toLocaleDateString()}</div>
          </div>
        </div>

        {match.venue && (
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-1">Venue</div>
            <div className="text-lg font-semibold text-gray-900">{match.venue}</div>
          </div>
        )}

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          {match.status === 'scheduled' && (
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Start Match
            </button>
          )}
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Edit Match
          </button>
          <button className="flex-1 bg-red-100 text-red-700 py-3 px-6 rounded-xl font-semibold hover:bg-red-200 transition-colors">
            Delete Match
          </button>
        </div>
      </div>
    </div>
  )
}
