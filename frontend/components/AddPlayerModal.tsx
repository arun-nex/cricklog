'use client'

import { useState } from 'react'
import { CreatePlayerRequest } from '@/types/Team'

interface AddPlayerModalProps {
  teamId: string
  teamName: string
  onClose: () => void
  onPlayerAdded: () => void
}

export default function AddPlayerModal({ teamId, teamName, onClose, onPlayerAdded }: AddPlayerModalProps) {
  const [formData, setFormData] = useState<CreatePlayerRequest>({
    team_id: teamId,
    name: '',
    role: 'batsman',
    batting_style: 'right-handed',
    bowling_style: 'right-arm medium',
    jersey_number: undefined
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Player added successfully!')
        onPlayerAdded()
        onClose()
      } else {
        alert('Failed to add player: ' + data.message)
      }
    } catch (error) {
      console.error('Error adding player:', error)
      alert('Failed to add player')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Player</h2>
            <p className="text-gray-600">Add a new player to {teamName}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Player Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter player name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jersey Number
              </label>
              <input
                type="number"
                value={formData.jersey_number || ''}
                onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900 placeholder-gray-500"
                placeholder="e.g., 7"
                min="1"
                max="99"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
            >
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="all-rounder">All-Rounder</option>
              <option value="wicket-keeper">Wicket Keeper</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Batting Style
              </label>
              <select
                value={formData.batting_style || 'right-handed'}
                onChange={(e) => setFormData({ ...formData, batting_style: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
              >
                <option value="right-handed">Right-Handed</option>
                <option value="left-handed">Left-Handed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bowling Style
              </label>
              <select
                value={formData.bowling_style || 'right-arm medium'}
                onChange={(e) => setFormData({ ...formData, bowling_style: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
              >
                <option value="right-arm fast">Right-Arm Fast</option>
                <option value="right-arm medium">Right-Arm Medium</option>
                <option value="right-arm spin">Right-Arm Spin</option>
                <option value="left-arm fast">Left-Arm Fast</option>
                <option value="left-arm medium">Left-Arm Medium</option>
                <option value="left-arm spin">Left-Arm Spin</option>
                <option value="leg-spin">Leg Spin</option>
                <option value="off-spin">Off Spin</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
