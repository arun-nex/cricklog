'use client'

import { useState, useEffect } from 'react'
import { PlayerStats, PlayerPerformance, TeamStats } from '@/types/PlayerStats'

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams' | 'performance'>('players')
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [playerPerformance, setPlayerPerformance] = useState<PlayerPerformance[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('runs')
  const [selectedTeam, setSelectedTeam] = useState('')

  useEffect(() => {
    fetchPlayerStats()
    fetchPlayerPerformance()
    fetchTeamStats()
  }, [])

  const fetchPlayerStats = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedTeam) params.append('team_id', selectedTeam)
      if (sortBy) params.append('sort_by', sortBy)
      params.append('limit', '20')

      const response = await fetch(`https://cricklog-2dk4.vercel.app/api/player-stats?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPlayerStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching player statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlayerPerformance = async () => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/player-stats/performance?limit=10')
      const data = await response.json()
      
      if (data.success) {
        setPlayerPerformance(data.data)
      }
    } catch (error) {
      console.error('Error fetching player performance:', error)
    }
  }

  const fetchTeamStats = async () => {
    try {
      const response = await fetch('https://cricklog-2dk4.vercel.app/api/player-stats/teams')
      const data = await response.json()
      
      if (data.success) {
        setTeamStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching team statistics:', error)
    }
  }

  const getFormColor = (form: string) => {
    switch (form) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'average': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getFormIcon = (form: string) => {
    switch (form) {
      case 'excellent': return '🔥'
      case 'good': return '👍'
      case 'average': return '😐'
      case 'poor': return '👎'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading statistics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Statistics Dashboard
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Track player performance, team statistics, and match analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'players', label: 'Player Stats', icon: '👤' },
                { id: 'teams', label: 'Team Stats', icon: '🏏' },
                { id: 'performance', label: 'Performance', icon: '🏆' }
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

        {/* Player Statistics Tab */}
        {activeTab === 'players' && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  >
                    <option value="runs">Runs Scored</option>
                    <option value="average">Batting Average</option>
                    <option value="wickets">Wickets Taken</option>
                    <option value="strike_rate">Strike Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Team</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-600 transition-all bg-white text-black font-medium"
                  >
                    <option value="">All Teams</option>
                    {Array.from(new Set(playerStats.map(stat => stat.team_id))).map(teamId => {
                      const team = playerStats.find(stat => stat.team_id === teamId)
                      return (
                        <option key={teamId} value={teamId}>
                          {team?.team_name}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <button
                  onClick={fetchPlayerStats}
                  className="bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Player Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerStats.map((stat) => (
                <div key={stat.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{stat.player_name}</h3>
                    <div className="text-sm text-white/70">{stat.team_name}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-300">{stat.runs_scored}</div>
                        <div className="text-sm text-white/70">Runs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-300">{stat.wickets_taken}</div>
                        <div className="text-sm text-white/70">Wickets</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-300">{stat.batting_average.toFixed(1)}</div>
                        <div className="text-sm text-white/70">Batting Avg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-300">{stat.bowling_average.toFixed(1)}</div>
                        <div className="text-sm text-white/70">Bowling Avg</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-300">{stat.strike_rate.toFixed(1)}</div>
                        <div className="text-sm text-white/70">Strike Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-300">{stat.economy_rate.toFixed(1)}</div>
                        <div className="text-sm text-white/70">Economy</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-sm text-white/70">
                      <span>{stat.matches_played} matches</span>
                      <span>{stat.centuries}C, {stat.half_centuries}50s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Statistics Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            {teamStats.map((team) => (
              <div key={team.team_id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">{team.team_name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-300">{team.win_percentage.toFixed(1)}%</div>
                    <div className="text-sm text-white/70">Win Rate</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-300 mb-2">{team.matches_won}</div>
                    <div className="text-white/70">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-300 mb-2">{team.matches_lost}</div>
                    <div className="text-white/70">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-300 mb-2">{team.matches_played}</div>
                    <div className="text-white/70">Total Matches</div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Batting</h4>
                    <div className="space-y-2 text-white/70">
                      <div>Total Runs: <span className="font-semibold text-white">{team.total_runs_scored}</span></div>
                      <div>Highest Total: <span className="font-semibold text-white">{team.highest_total}</span></div>
                      <div>Top Batsman: <span className="font-semibold text-white">{team.top_batsman}</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Bowling</h4>
                    <div className="space-y-2 text-white/70">
                      <div>Runs Conceded: <span className="font-semibold text-white">{team.total_runs_conceded}</span></div>
                      <div>Best Figures: <span className="font-semibold text-white">{team.best_bowling_figures}</span></div>
                      <div>Top Bowler: <span className="font-semibold text-white">{team.top_bowler}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {playerPerformance.map((player, index) => (
              <div key={player.player_id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{player.player_name}</h3>
                    <div className="text-white/70">{player.team_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-300">#{index + 1}</div>
                    <div className="text-sm text-white/70">Overall Rank</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300 mb-2">#{player.batting_rank}</div>
                    <div className="text-white/70">Batting Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300 mb-2">#{player.bowling_rank}</div>
                    <div className="text-white/70">Bowling Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300 mb-2">#{player.all_rounder_rank}</div>
                    <div className="text-white/70">All-Rounder Rank</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${getFormColor(player.recent_form)}`}>
                      {getFormIcon(player.recent_form)}
                    </div>
                    <div className="text-white/70 capitalize">{player.recent_form} Form</div>
                  </div>
                </div>
                
                {player.key_achievements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Key Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {player.key_achievements.map((achievement, idx) => (
                        <span key={idx} className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-sm font-semibold">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Data Message */}
        {((activeTab === 'players' && playerStats.length === 0) ||
          (activeTab === 'teams' && teamStats.length === 0) ||
          (activeTab === 'performance' && playerPerformance.length === 0)) && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
              <div className="text-6xl mb-6">📊</div>
              <div className="text-white/60 text-xl mb-6 font-medium">
                No statistics available yet
              </div>
              <div className="text-white/50 text-sm">
                Statistics will appear after matches are played and scored
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
