export default function TeamScore({ team, teamKey }) {
  return (
    <div className="team-row">
      <div className="team-info">
        {team.logo ? (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="team-logo"
          />
        ) : (
          <div className="team-logo-placeholder">
            {team.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="team-name">{team.name}</span>
      </div>
      <span className="team-score">{team.score}</span>
    </div>
  )
}
