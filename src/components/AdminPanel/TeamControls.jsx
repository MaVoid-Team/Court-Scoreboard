import { useScoreboard } from '../../context/ScoreboardContext'

export default function TeamControls() {
  const { state, updateState } = useScoreboard()

  const handleNameChange = (team, value) => {
    updateState(prev => ({
      ...prev,
      [team]: { ...prev[team], name: value },
    }))
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="admin-card-icon blue">👥</div>
        <span className="admin-card-title">Team Setup</span>
      </div>
      <div className="admin-card-body">
        <div className="team-cols">
          <div>
            <p className="team-col-label team-a">Team A</p>
            <input
              type="text"
              className="form-input"
              placeholder="Team A name"
              value={state.teamA.name}
              onChange={e => handleNameChange('teamA', e.target.value)}
            />
          </div>
          <div>
            <p className="team-col-label team-b">Team B</p>
            <input
              type="text"
              className="form-input"
              placeholder="Team B name"
              value={state.teamB.name}
              onChange={e => handleNameChange('teamB', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
