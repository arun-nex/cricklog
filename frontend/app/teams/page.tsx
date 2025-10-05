'use client'

import { useState, useEffect } from 'react'
import { Team, Player } from '@/types/Team'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-green to-primary-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading teams...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-green to-primary-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏏 Team Management
          </h1>
          <p className="text-white/80">
            Create and manage cricket teams
          </p>
        </div>

        {/* Create Team Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            + Create New Team
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                <span className="text-sm text-gray-500">
                  {team.players?.length || 0} players
                </span>
              </div>
              
              {team.description && (
                <p className="text-gray-600 mb-4">{team.description}</p>
              )}
              
              {team.captain && (
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">Captain:</span> {team.captain}
                </p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => {/* TODO: Edit team */}}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Teams Message */}
        {teams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              No teams created yet
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Your First Team
            </button>
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Team</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter team name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter team description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Captain
            </label>
            <input
              type="text"
              value={formData.captain}
              onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter captain name"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Team
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Team Details Modal Component
function TeamDetailsModal({ team, onClose }: { team: Team; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {team.description && (
          <p className="text-gray-600 mb-4">{team.description}</p>
        )}

        {team.captain && (
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold">Captain:</span> {team.captain}
          </p>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Players ({team.players?.length || 0})</h3>
          
          {team.players && team.players.length > 0 ? (
            <div className="space-y-2">
              {team.players.map((player) => (
                <div key={player.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{player.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{player.role}</div>
                  </div>
                  {player.jersey_number && (
                    <div className="text-sm text-gray-500">#{player.jersey_number}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No players added yet
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
            Add Player
          </button>
          <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
            Edit Team
          </button>
        </div>
      </div>
    </div>
  )
}
