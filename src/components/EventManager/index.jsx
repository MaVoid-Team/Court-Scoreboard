import { useState } from 'react'
import { useScoreboard } from '../../context/ScoreboardContext'
import { EVENT_TYPES } from '../../utils/eventTypes'
import EventFeed from './EventFeed'

export default function EventManager() {
  const { state, updateState } = useScoreboard()
  const [selectedTeam, setSelectedTeam] = useState('A')
  const [playerId, setPlayerId]         = useState('')
  const [eventType, setEventType]       = useState('goal')
  const [minute, setMinute]             = useState('')

  const { teamA, teamB, players, events, timer } = state
  const currentMinute   = Math.floor(timer / 60)
  const teamPlayers     = players.filter(p => p.team === selectedTeam)

  const handleTeamChange = (t) => { setSelectedTeam(t); setPlayerId('') }

  const handleAdd = () => {
    const m = minute !== '' ? parseInt(minute, 10) : currentMinute

    updateState(prev => {
      const newEvent = {
        id: Date.now().toString(),
        type: eventType,
        playerId: playerId || null,
        team: selectedTeam,
        minute: m,
        timestamp: Date.now(),
      }

      // Auto-update player stats
      const STAT_MAP = { goal: 'goals', assist: 'assists', yellowCard: 'yellowCards', redCard: 'redCards' }
      const statKey = STAT_MAP[eventType]
      const newPlayers = (playerId && statKey)
        ? prev.players.map(p =>
            p.id === playerId ? { ...p, stats: { ...p.stats, [statKey]: p.stats[statKey] + 1 } } : p
          )
        : prev.players

      return { ...prev, events: [...prev.events, newEvent], players: newPlayers }
    })

    setPlayerId('')
    setMinute('')
  }

  const clearEvents = () => updateState(prev => ({ ...prev, events: [] }))

  return (
    <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
      <div className="admin-card-header">
        <div className="admin-card-icon blue">⚡</div>
        <span className="admin-card-title">Match Events</span>
      </div>
      <div className="admin-card-body">
        <div className="event-manager-layout">

          {/* ── Form ── */}
          <div className="event-form">
            {/* Team */}
            <div className="event-form-row">
              <div className="event-form-group">
                <label className="event-form-label">Team</label>
                <div className="event-team-btns">
                  <button
                    className={`btn ${selectedTeam === 'A' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleTeamChange('A')}
                  >
                    {teamA.name}
                  </button>
                  <button
                    className={`btn ${selectedTeam === 'B' ? 'btn-danger' : 'btn-ghost'}`}
                    onClick={() => handleTeamChange('B')}
                  >
                    {teamB.name}
                  </button>
                </div>
              </div>

              {/* Player */}
              <div className="event-form-group">
                <label className="event-form-label">Player</label>
                <select className="form-input" value={playerId} onChange={e => setPlayerId(e.target.value)}>
                  <option value="">— No specific player —</option>
                  {teamPlayers.map(p => (
                    <option key={p.id} value={p.id}>#{p.number} {p.name}</option>
                  ))}
                </select>
              </div>

              {/* Minute */}
              <div className="event-form-group event-form-group--sm">
                <label className="event-form-label">Minute</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder={currentMinute}
                  value={minute}
                  onChange={e => setMinute(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Event type grid */}
            <div className="event-type-grid">
              {EVENT_TYPES.map(et => (
                <button
                  key={et.value}
                  className={`event-type-btn${eventType === et.value ? ' active' : ''}`}
                  onClick={() => setEventType(et.value)}
                >
                  <span className="event-type-icon">{et.icon}</span>
                  <span className="event-type-label">{et.label}</span>
                </button>
              ))}
            </div>

            <button className="btn btn-primary btn-xl" onClick={handleAdd}>
              + Add Event
            </button>
          </div>

          {/* ── Feed ── */}
          <div className="event-feed-section">
            <EventFeed events={events} players={players} onClear={clearEvents} />
          </div>

        </div>
      </div>
    </div>
  )
}
