'use client'

import { useState, useEffect } from 'react'
import { MatchHistory, MatchHistorySummary, MatchFilter } from '@/types/MatchHistory'
import { Team } from '@/types/Team'

export default function MatchHistoryPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'summary' | 'reports'>('matches')
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [summary, setSummary] = useState<MatchHistorySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<MatchFilter>({})
  const [selectedMatch, setSelectedMatch] = useState<MatchHistory | null>(null)

  useEffect(() => {
    fetchMatchHistory()
    fetchTeams()
    fetchSummary()
  }, [])

  const fetchMatchHistory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.team_id) params.append('team_id', filters.team_id)
      if (filters.match_type) params.append('match_type', filters.match_type)
      if (filters.status) params.append('status', filters.status)
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      if (filters.venue) params.append('venue', filters.venue)
      if (filters.result_type) params.append('result_type', filters.result_type)
      
      params.append('limit', '20')

      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/match-history?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setMatchHistory(data.data)
      }
    } catch (error) {
      console.error('Error fetching match history:', error)
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

  const fetchSummary = async () => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/match-history/summary')
      const data = await response.json()
      
      if (data.success) {
        setSummary(data.data)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleFilterChange = (key: keyof MatchFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const applyFilters = () => {
    fetchMatchHistory()
  }

  const clearFilters = () => {
    setFilters({})
    fetchMatchHistory()
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'won': return 'text-green-400'
      case 'tied': return 'text-yellow-400'
      case 'no_result': return 'text-gray-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-white/70'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-500/20 text-blue-300'
      case 'live': return 'bg-green-500/20 text-green-300'
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-300'
      case 'cancelled': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading match history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Match History & Reports
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Comprehensive match analytics, historical data, and detailed reports
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'matches', label: 'Match History', icon: '🏏' },
                { id: 'summary', label: 'Summary', icon: '📊' },
                { id: 'reports', label: 'Reports', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Match History Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Filter Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Team</label>
                  <select
                    value={filters.team_id || ''}
                    onChange={(e) => handleFilterChange('team_id', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  >
                    <option value="">All Teams</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Match Type</label>
                  <select
                    value={filters.match_type || ''}
                    onChange={(e) => handleFilterChange('match_type', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  >
                    <option value="">All Types</option>
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="Test">Test</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="live">Live</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Venue</label>
                  <input
                    type="text"
                    value={filters.venue || ''}
                    onChange={(e) => handleFilterChange('venue', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                    placeholder="Enter venue"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={applyFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Match History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchHistory.map((match) => (
                <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{match.match_name}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(match.status)}`}>
                      {match.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">{match.team1_name}</span>
                      <span className="text-white font-bold">
                        {match.result.innings_summary.find(i => i.team_id === match.team1_id)?.total_runs || 0}/
                        {match.result.innings_summary.find(i => i.team_id === match.team1_id)?.total_wickets || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">{match.team2_name}</span>
                      <span className="text-white font-bold">
                        {match.result.innings_summary.find(i => i.team_id === match.team2_id)?.total_runs || 0}/
                        {match.result.innings_summary.find(i => i.team_id === match.team2_id)?.total_wickets || 0}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-white/70">
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
                    {match.result.winner_name && (
                      <div className="flex justify-between">
                        <span>Winner:</span>
                        <span className={`font-semibold ${getResultColor(match.result.result_type)}`}>
                          {match.result.winner_name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                    >
                      View Details
                    </button>
                    <button className="bg-white/10 text-white py-2 px-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Matches Message */}
            {matchHistory.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
                  <div className="text-6xl mb-6">📈</div>
                  <div className="text-white/60 text-xl mb-6 font-medium">
                    No matches found
                  </div>
                  <div className="text-white/50 text-sm">
                    Try adjusting your filters or create some matches first
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && summary && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-primary-300 mb-2">{summary.total_matches}</div>
                <div className="text-white/70">Total Matches</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">{summary.completed_matches}</div>
                <div className="text-white/70">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">{summary.total_runs}</div>
                <div className="text-white/70">Total Runs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">{summary.total_wickets}</div>
                <div className="text-white/70">Total Wickets</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Match Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Average Score:</span>
                    <span className="text-white font-semibold">{summary.average_score.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Highest Score:</span>
                    <span className="text-white font-semibold">{summary.highest_score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Live Matches:</span>
                    <span className="text-white font-semibold">{summary.live_matches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Scheduled Matches:</span>
                    <span className="text-white font-semibold">{summary.scheduled_matches}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Top Performers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Most Runs:</span>
                    <span className="text-white font-semibold">{summary.most_runs_by_player}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Most Wickets:</span>
                    <span className="text-white font-semibold">{summary.most_wickets_by_player}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Most Matches:</span>
                    <span className="text-white font-semibold">{summary.most_matches_played}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Match Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Match Analytics</h4>
                  <p className="text-white/70 text-sm mb-4">Detailed match statistics and performance analysis</p>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Generate Report
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Team Performance</h4>
                  <p className="text-white/70 text-sm mb-4">Team-wise performance reports and trends</p>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Generate Report
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">👤</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Player Reports</h4>
                  <p className="text-white/70 text-sm mb-4">Individual player performance and statistics</p>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

// Match Details Modal Component
function MatchDetailsModal({ match, onClose }: { match: MatchHistory; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{match.match_name}</h2>
            <p className="text-gray-600 text-lg">
              {match.team1_name} vs {match.team2_name}
            </p>
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
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {match.result.innings_summary.find(i => i.team_id === match.team1_id)?.total_runs || 0}/
              {match.result.innings_summary.find(i => i.team_id === match.team1_id)?.total_wickets || 0}
            </div>
            <div className="text-gray-600">
              {match.result.innings_summary.find(i => i.team_id === match.team1_id)?.total_overs || 0} overs
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{match.team2_name}</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {match.result.innings_summary.find(i => i.team_id === match.team2_id)?.total_runs || 0}/
              {match.result.innings_summary.find(i => i.team_id === match.team2_id)?.total_wickets || 0}
            </div>
            <div className="text-gray-600">
              {match.result.innings_summary.find(i => i.team_id === match.team2_id)?.total_overs || 0} overs
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Match Type</div>
            <div className="text-lg font-semibold text-gray-900">{match.match_type}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Date</div>
            <div className="text-lg font-semibold text-gray-900">{new Date(match.date).toLocaleDateString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Venue</div>
            <div className="text-lg font-semibold text-gray-900">{match.venue || 'TBD'}</div>
          </div>
        </div>

        {match.result.winner_name && (
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-1">Result</div>
            <div className="text-2xl font-bold text-green-600">{match.result.winner_name} won</div>
            {match.result.margin && (
              <div className="text-gray-600">{match.result.margin}</div>
            )}
          </div>
        )}

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            View Full Report
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Download Report
          </button>
        </div>
      </div>
    </div>
  )
}
