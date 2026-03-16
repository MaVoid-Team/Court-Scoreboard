export default function PlayerCard({ player, onEdit, onDelete }) {
  const teamColor = player.team === 'A' ? 'blue' : player.team === 'B' ? 'red' : 'gray'

  return (
    <div className={`player-card player-card--${teamColor}`}>
      <div className="player-card-photo-wrap">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="player-card-photo" />
        ) : (
          <div className="player-card-initials">{player.name.charAt(0).toUpperCase()}</div>
        )}
        <span className="player-card-number">#{player.number}</span>
      </div>

      <div className="player-card-info">
        <div className="player-card-name">{player.name}</div>
        <div className="player-card-position">{player.position || '—'}</div>
        <div className="player-card-stats">
          <span title="Goals">⚽ {player.stats.goals}</span>
          <span title="Assists">🅰️ {player.stats.assists}</span>
          <span title="Yellow Cards">🟨 {player.stats.yellowCards}</span>
          <span title="Red Cards">🟥 {player.stats.redCards}</span>
        </div>
      </div>

      <div className="player-card-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(player)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(player.id)}>Delete</button>
      </div>
    </div>
  )
}
