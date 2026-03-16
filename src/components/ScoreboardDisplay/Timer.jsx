import { useScoreboard } from '../../context/ScoreboardContext'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const { state } = useScoreboard()
  return (
    <span className={`timer-value${state.timerRunning ? ' running' : ''}`}>
      {formatTime(state.timer)}
    </span>
  )
}
