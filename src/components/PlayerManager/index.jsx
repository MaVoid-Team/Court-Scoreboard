import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScoreboard } from '../../context/ScoreboardContext'
import PlayerCard from './PlayerCard'
import PlayerForm from './PlayerForm'
import LineupSelector from './LineupSelector'

export default function PlayerManager() {
  const { state, updateState } = useScoreboard()
  const [tab, setTab]             = useState('players')
  const [showForm, setShowForm]   = useState(false)
  const [editing, setEditing]     = useState(null)

  const { players, lineups, teamA, teamB } = state

  const openAdd  = ()       => { setEditing(null);   setShowForm(true) }
  const openEdit = (player) => { setEditing(player); setShowForm(true) }
  const closeForm= ()       => { setShowForm(false); setEditing(null)  }

  const savePlayer = (data) => {
    if (editing) {
      updateState(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === editing.id ? { ...p, ...data } : p),
      }))
    } else {
      updateState(prev => ({
        ...prev,
        players: [...prev.players, { id: Date.now().toString(), ...data }],
      }))
    }
    closeForm()
  }

  const deletePlayer = (id) => {
    if (!window.confirm('Delete this player?')) return
    updateState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id),
      lineups: {
        teamA: prev.lineups.teamA.filter(pid => pid !== id),
        teamB: prev.lineups.teamB.filter(pid => pid !== id),
      },
    }))
  }

  const toggleLineup = (teamKey, playerId) => {
    updateState(prev => {
      const current = prev.lineups[teamKey]
      const updated = current.includes(playerId)
        ? current.filter(id => id !== playerId)
        : [...current, playerId]
      return { ...prev, lineups: { ...prev.lineups, [teamKey]: updated } }
    })
  }

  const groups = [
    { id: 'A', label: `${teamA.name} — Team A`, color: 'blue',  players: players.filter(p => p.team === 'A') },
    { id: 'B', label: `${teamB.name} — Team B`, color: 'red',   players: players.filter(p => p.team === 'B') },
    { id: null, label: 'Unassigned',             color: 'gray',  players: players.filter(p => !p.team) },
  ].filter(g => g.players.length > 0)

  return (
    <div className="admin-root">
      {/* Header */}
      <header className="admin-header">
        <span className="admin-header-title">👤 Player Management</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-header-badge">{players.length} Players</span>
          <Link to="/admin" className="view-display-link">← Back to Admin</Link>
        </div>
      </header>

      <div className="admin-body">
        {/* Tabs */}
        <div className="pm-tabs">
          <button className={`pm-tab${tab === 'players' ? ' active' : ''}`} onClick={() => setTab('players')}>
            Players ({players.length})
          </button>
          <button className={`pm-tab${tab === 'lineups' ? ' active' : ''}`} onClick={() => setTab('lineups')}>
            Lineups
          </button>
        </div>

        {/* Players tab */}
        {tab === 'players' && (
          <>
            <div className="pm-toolbar">
              <button className="btn btn-primary" onClick={openAdd}>+ Add Player</button>
            </div>

            {players.length === 0 ? (
              <div className="pm-empty">
                <div className="pm-empty-icon">👤</div>
                <p>No players added yet.</p>
                <button className="btn btn-primary" onClick={openAdd}>Add First Player</button>
              </div>
            ) : (
              groups.map(group => (
                <div key={group.id ?? 'none'} className="pm-group">
                  <h3 className={`pm-group-title pm-group-title--${group.color}`}>{group.label}</h3>
                  <div className="pm-player-grid">
                    {group.players.map(player => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        onEdit={openEdit}
                        onDelete={deletePlayer}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Lineups tab */}
        {tab === 'lineups' && (
          <LineupSelector
            players={players}
            lineups={lineups}
            teamA={teamA}
            teamB={teamB}
            onToggle={toggleLineup}
          />
        )}
      </div>

      {showForm && (
        <PlayerForm
          initial={editing}
          teamA={teamA.name}
          teamB={teamB.name}
          onSave={savePlayer}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}
