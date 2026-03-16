import { EVENT_ICON, EVENT_LABEL } from '../../utils/eventTypes'

export default function EventItem({ event, players, compact }) {
  const player = players?.find(p => p.id === event.playerId)
  const icon  = EVENT_ICON[event.type]  ?? '•'
  const label = EVENT_LABEL[event.type] ?? event.type

  return (
    <div className={`event-item event-item--${event.team.toLowerCase()}${compact ? ' event-item--compact' : ''}`}>
      <span className="event-item-minute">{event.minute}'</span>
      <span className="event-item-icon">{icon}</span>
      <span className="event-item-text">
        <span className="event-item-label">{label}</span>
        {player && <span className="event-item-player"> — {player.name} #{player.number}</span>}
      </span>
      <span className={`event-item-badge event-item-badge--${event.team.toLowerCase()}`}>
        {event.team}
      </span>
    </div>
  )
}
