export default function TeamScore({ team, side }) {
  return (
    <div className={`team-panel team-panel--${side}`}>
      <div className="team-panel-logo-wrap">
        {team.logo ? (
          <img src={team.logo} alt={`${team.name} logo`} className="team-panel-logo" />
        ) : (
          <div className="team-panel-logo-placeholder">
            {team.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="team-panel-score">{team.score}</span>
      <span className="team-panel-name">{team.name}</span>
    </div>
  )
}
