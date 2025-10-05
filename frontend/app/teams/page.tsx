'use client'

import { useState, useEffect } from 'react'
import { Team, Player } from '@/types/Team'
import AddPlayerModal from '@/components/AddPlayerModal'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [showAddPlayer, setShowAddPlayer] = useState(false)

  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/teams')
      const data = await response.json()
      
      if (data.success) {
        setTeams(data.data)
      } else {
        console.error('Failed to fetch teams:', data.message)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTeam = async (teamData: { name: string; description?: string; captain?: string }) => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTeams([...teams, data.data])
        setShowCreateForm(false)
        alert('Team created successfully!')
      } else {
        alert('Failed to create team: ' + data.message)
      }
    } catch (error) {
      console.error('Error creating team:', error)
      alert('Failed to create team')
    }
  }

  const handlePlayerAdded = () => {
    // Refresh the selected team data
    if (selectedTeam) {
      fetchTeamDetails(selectedTeam.id)
    }
  }

  const fetchTeamDetails = async (teamId: string) => {
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/teams/${teamId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedTeam(data.data)
        // Update the team in the teams list
        setTeams(teams.map(team => team.id === teamId ? data.data : team))
      }
    } catch (error) {
      console.error('Error fetching team details:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-green to-primary-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading teams...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <span className="text-3xl">🏏</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Team Management
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Create and manage cricket teams with professional player profiles
          </p>
        </div>

        {/* Create Team Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Team</span>
            </span>
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <div key={team.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">{team.name}</h3>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <span className="text-sm text-white/70">👥</span>
                  <span className="text-sm font-semibold text-white">
                    {team.players?.length || 0}
                  </span>
                </div>
              </div>
              
              {team.description && (
                <p className="text-white/70 mb-4 line-clamp-2">{team.description}</p>
              )}
              
              {team.captain && (
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-white/50">👑</span>
                  <span className="text-sm text-white/70">
                    <span className="font-semibold">Captain:</span> {team.captain}
                  </span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                >
                  View Details
                </button>
                <button
                  onClick={() => {/* TODO: Edit team */}}
                  className="bg-white/10 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Teams Message */}
        {teams.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
              <div className="text-6xl mb-6">🏏</div>
              <div className="text-white/60 text-xl mb-6 font-medium">
                No teams created yet
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your First Team
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateForm && (
        <CreateTeamModal
          onClose={() => setShowCreateForm(false)}
          onCreate={createTeam}
        />
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onAddPlayer={() => setShowAddPlayer(true)}
        />
      )}

      {/* Add Player Modal */}
      {showAddPlayer && selectedTeam && (
        <AddPlayerModal
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          onClose={() => setShowAddPlayer(false)}
          onPlayerAdded={handlePlayerAdded}
        />
      )}
    </div>
  )
}

// Create Team Modal Component
function CreateTeamModal({ onClose, onCreate }: { onClose: () => void; onCreate: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    captain: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onCreate(formData)
      setFormData({ name: '', description: '', captain: '' })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Team</h2>
            <p className="text-gray-600">Set up your cricket team</p>
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
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter team name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter team description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Captain
            </label>
            <input
              type="text"
              value={formData.captain}
              onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter captain name"
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
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Team Details Modal Component
function TeamDetailsModal({ team, onClose, onAddPlayer }: { team: Team; onClose: () => void; onAddPlayer: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h2>
            {team.description && (
              <p className="text-gray-600 text-lg">{team.description}</p>
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

        {team.captain && (
          <div className="flex items-center space-x-3 mb-8 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
            <span className="text-2xl">👑</span>
            <div>
              <span className="font-semibold text-gray-900">Captain:</span>
              <span className="text-gray-700 ml-2">{team.captain}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Players ({team.players?.length || 0})
            </h3>
            <button
              onClick={onAddPlayer}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Player</span>
              </span>
            </button>
          </div>
          
          {team.players && team.players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.players.map((player) => (
                <div key={player.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xl font-bold text-gray-900 mb-1">{player.name}</div>
                      <div className="text-sm text-gray-600 capitalize font-medium">{player.role.replace('-', ' ')}</div>
                    </div>
                    {player.jersey_number && (
                      <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-bold">
                        #{player.jersey_number}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {player.batting_style && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">🏏</span>
                        <span className="text-sm text-gray-600 capitalize">{player.batting_style}</span>
                      </div>
                    )}
                    {player.bowling_style && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">⚾</span>
                        <span className="text-sm text-gray-600 capitalize">{player.bowling_style}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-xl text-gray-500 mb-4 font-medium">No players added yet</div>
              <button
                onClick={onAddPlayer}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Add Your First Player
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Edit Team
          </button>
          <button className="flex-1 bg-red-100 text-red-700 py-3 px-6 rounded-xl font-semibold hover:bg-red-200 transition-colors">
            Delete Team
          </button>
        </div>
      </div>
    </div>
  )
}
