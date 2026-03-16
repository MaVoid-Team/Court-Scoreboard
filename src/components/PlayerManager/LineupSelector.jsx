export default function LineupSelector({ players, lineups, teamA, teamB, onToggle }) {
  const sides = [
    { key: 'teamA', label: teamA.name, color: 'blue', teamId: 'A' },
    { key: 'teamB', label: teamB.name, color: 'red',  teamId: 'B' },
  ]

  return (
    <div className="lineup-selector">
      {sides.map(({ key, label, color, teamId }) => {
        const teamPlayers = players.filter(p => p.team === teamId)
        const activeIds   = lineups[key]

        return (
          <div key={key} className={`lineup-team lineup-team--${color}`}>
            <div className="lineup-team-header">
              <span className="lineup-team-name">{label}</span>
              <span className="lineup-active-count">{activeIds.length} active</span>
            </div>

            {teamPlayers.length === 0 ? (
              <p className="lineup-empty">No players assigned to this team yet.</p>
            ) : (
              <div className="lineup-player-list">
                {teamPlayers.map(player => {
                  const active = activeIds.includes(player.id)
                  return (
                    <label
                      key={player.id}
                      className={`lineup-player${active ? ' lineup-player--active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => onToggle(key, player.id)}
                      />
                      {player.photo ? (
                        <img src={player.photo} alt={player.name} className="lineup-player-photo" />
                      ) : (
                        <div className="lineup-player-avatar">{player.name.charAt(0)}</div>
                      )}
                      <span className="lineup-player-number">#{player.number}</span>
                      <span className="lineup-player-name">{player.name}</span>
                      <span className="lineup-player-pos">{player.position}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
