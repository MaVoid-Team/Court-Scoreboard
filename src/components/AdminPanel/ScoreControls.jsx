import { useEffect, useRef } from 'react'
import { useScoreboard } from '../../context/ScoreboardContext'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function ScoreControls() {
  const { state, updateState } = useScoreboard()
  const intervalRef = useRef(null)

  // Timer tick — only runs in admin tab
  useEffect(() => {
    if (state.timerRunning) {
      intervalRef.current = setInterval(() => {
        updateState(prev => ({ ...prev, timer: prev.timer + 1 }))
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.timerRunning, updateState])

  const adjustScore = (team, delta) => {
    updateState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        score: Math.max(0, prev[team].score + delta),
      },
    }))
  }

  const adjustSet = (team, delta) => {
    updateState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        sets: Math.max(0, prev[team].sets + delta),
      },
    }))
  }

  const resetCurrentGame = () => {
    updateState(prev => ({
      ...prev,
      teamA: { ...prev.teamA, score: 0 },
      teamB: { ...prev.teamB, score: 0 },
    }))
  }

  const toggleServe = () => {
    updateState(prev => ({ ...prev, serve: prev.serve === 'A' ? 'B' : 'A' }))
  }

  const startTimer = () => {
    updateState(prev => ({ ...prev, timerRunning: true }))
  }

  const pauseTimer = () => {
    updateState(prev => ({ ...prev, timerRunning: false }))
  }

  const resetTimer = () => {
    updateState(prev => ({ ...prev, timer: 0, timerRunning: false }))
  }

  const { teamA, teamB, serve, timer, timerRunning } = state
  const servingName = serve === 'A' ? teamA.name : teamB.name

  return (
    <>
      {/* Score Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-icon green">🏆</div>
          <span className="admin-card-title">Score Controls</span>
        </div>
        <div className="admin-card-body">
          <div className="team-cols">
            {/* Team A */}
            <div>
              <p className="team-col-label team-a">{teamA.name}</p>
              <div className="score-display">
                <div>
                  <div className="score-display-label">Points</div>
                  <div className="score-badge">{teamA.score}</div>
                </div>
              </div>
              <div className="score-btn-row">
                <button
                  className="btn btn-success"
                  onClick={() => adjustScore('teamA', 1)}
                >
                  + Point
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => adjustScore('teamA', -1)}
                  disabled={teamA.score === 0}
                >
                  − Point
                </button>
              </div>
            </div>

            {/* Team B */}
            <div>
              <p className="team-col-label team-b">{teamB.name}</p>
              <div className="score-display">
                <div>
                  <div className="score-display-label">Points</div>
                  <div className="score-badge">{teamB.score}</div>
                </div>
              </div>
              <div className="score-btn-row">
                <button
                  className="btn btn-success"
                  onClick={() => adjustScore('teamB', 1)}
                >
                  + Point
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => adjustScore('teamB', -1)}
                  disabled={teamB.score === 0}
                >
                  − Point
                </button>
              </div>
            </div>
          </div>

          <div className="divider" />
          <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} onClick={resetCurrentGame}>
            Reset Current Game Scores
          </button>
        </div>
      </div>

      {/* Set Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-icon purple">🎯</div>
          <span className="admin-card-title">Set Controls</span>
        </div>
        <div className="admin-card-body">
          <div className="team-cols">
            <div>
              <p className="team-col-label team-a">{teamA.name}</p>
              <div className="score-display">
                <div>
                  <div className="score-display-label">Sets Won</div>
                  <div className="sets-badge">{teamA.sets}</div>
                </div>
              </div>
              <div className="score-btn-row">
                <button className="btn btn-primary" onClick={() => adjustSet('teamA', 1)}>+ Set</button>
                <button className="btn btn-ghost" onClick={() => adjustSet('teamA', -1)} disabled={teamA.sets === 0}>− Set</button>
              </div>
            </div>
            <div>
              <p className="team-col-label team-b">{teamB.name}</p>
              <div className="score-display">
                <div>
                  <div className="score-display-label">Sets Won</div>
                  <div className="sets-badge">{teamB.sets}</div>
                </div>
              </div>
              <div className="score-btn-row">
                <button className="btn btn-primary" onClick={() => adjustSet('teamB', 1)}>+ Set</button>
                <button className="btn btn-ghost" onClick={() => adjustSet('teamB', -1)} disabled={teamB.sets === 0}>− Set</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Serve Control */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-icon orange">🏐</div>
          <span className="admin-card-title">Serve Control</span>
        </div>
        <div className="admin-card-body">
          <div className="serve-toggle">
            <div className="serve-current">
              <div className="serve-dot-admin" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Currently Serving</div>
                <div className="serve-name">{servingName}</div>
              </div>
            </div>
            <button className="btn btn-warning" onClick={toggleServe}>
              Switch Serve ⇄
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              className={`btn ${serve === 'A' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => updateState(prev => ({ ...prev, serve: 'A' }))}
            >
              {teamA.name} Serves
            </button>
            <button
              className={`btn ${serve === 'B' ? 'btn-danger' : 'btn-ghost'}`}
              onClick={() => updateState(prev => ({ ...prev, serve: 'B' }))}
            >
              {teamB.name} Serves
            </button>
          </div>
        </div>
      </div>

      {/* Timer Control */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-icon yellow">⏱</div>
          <span className="admin-card-title">Match Timer</span>
        </div>
        <div className="admin-card-body">
          <div className="timer-display-admin">{formatTime(timer)}</div>
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <span className={`timer-running-indicator ${timerRunning ? 'on' : 'off'}`}>
              <span className={`timer-dot${timerRunning ? ' pulse' : ''}`} />
              {timerRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
          <div className="timer-btn-row">
            <button
              className="btn btn-success btn-lg"
              onClick={startTimer}
              disabled={timerRunning}
            >
              ▶ Start
            </button>
            <button
              className="btn btn-warning btn-lg"
              onClick={pauseTimer}
              disabled={!timerRunning}
            >
              ⏸ Pause
            </button>
            <button className="btn btn-ghost btn-lg" onClick={resetTimer}>
              ↺ Reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
